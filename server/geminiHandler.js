import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'
import { redactPII } from './piiRedactor.js'

/**
 * Securely retrieve Gemini API key from process env or .env.local on the server side.
 * @returns {string|null}
 */
function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY

  for (const envFile of ['.env.local', '.env']) {
    try {
      const fullPath = path.resolve(process.cwd(), envFile)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        for (const line of content.split('\n')) {
          const trimmed = line.trim()
          if (trimmed.startsWith('GEMINI_API_KEY=')) {
            const val = trimmed.slice('GEMINI_API_KEY='.length).trim().replace(/^["']|["']$/g, '')
            if (val) return val
          }
          if (trimmed.startsWith('VITE_GEMINI_API_KEY=')) {
            const val = trimmed.slice('VITE_GEMINI_API_KEY='.length).trim().replace(/^["']|["']$/g, '')
            if (val) return val
          }
        }
      }
    } catch (e) {
      // ignore read errors
    }
  }
  return null
}

const SYSTEM_INSTRUCTION = `You are a regulatory compliance analysis assistant for DigiLend Audit.

You evaluate one RBI compliance rule at a time using ONLY the supplied evidence.

Do not invent facts.

Do not assume a requirement is satisfied merely because information is missing.

If the supplied evidence is insufficient to determine compliance, return UNCLEAR.

Return FAIL only when the supplied evidence supports a finding of non-compliance.

Return PASS only when the supplied evidence supports compliance with the specific rule.

Do not provide legal advice.

Do not create regulatory requirements that are not present in the supplied rule.

Use the rule's supplied RBI reference and description as the governing requirement.`

// ── Rate-limit retry configuration ─────────────────────────────────
const GEMINI_MAX_RETRIES    = 3
const GEMINI_RETRY_DELAY_MS = 20_000  // base delay (ms) on 429; multiplied by attempt number

/**
 * Calls ai.models.generateContent with limited retry logic.
 * Retries ONLY on 429 RESOURCE_EXHAUSTED; all other errors are re-thrown.
 * Max attempts: GEMINI_MAX_RETRIES (3). Delays: 20s, 40s.
 * @param {object} ai       - GoogleGenAI instance
 * @param {object} params   - generateContent params
 * @param {string} ruleId   - used for safe log messages only
 * @returns {Promise<object>} Gemini API response
 */
async function generateContentWithRetry(ai, params, ruleId) {
  let lastErr
  for (let attempt = 1; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent(params)
      if (attempt > 1) {
        console.log(`[geminiHandler] Rule: ${ruleId} | Succeeded on retry attempt ${attempt}`)
      }
      return response
    } catch (err) {
      lastErr = err
      const is429 = (err.message ?? '').includes('429') ||
                    (err.message ?? '').includes('RESOURCE_EXHAUSTED')
      console.warn(
        `[geminiHandler] Rule: ${ruleId} | Attempt ${attempt}/${GEMINI_MAX_RETRIES} | ` +
        `${is429 ? '429 rate-limit' : 'error'}: ${(err.message ?? 'unknown').slice(0, 160)}`
      )
      if (is429 && attempt < GEMINI_MAX_RETRIES) {
        const delay = GEMINI_RETRY_DELAY_MS * attempt
        console.log(`[geminiHandler] Rule: ${ruleId} | Waiting ${delay}ms before retry ${attempt + 1}…`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw err
    }
  }
  throw lastErr
}

/**
 * Vite server middleware for POST /api/gemini
 */
export async function geminiMiddleware(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }))
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', async () => {
    try {
      const payload = JSON.parse(body || '{}')
      const { ruleId, requirement, clauseReference, documentText = '' } = payload

      const apiKey = getGeminiApiKey()
      if (!apiKey) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({
          verdict: 'unclear',
          evidence: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in .env.local.',
          reasoning: 'Missing GEMINI_API_KEY server environment variable.'
        }))
      }

      // ── PII Redaction Step ──────────────────────────────────────────
      const piiResult = redactPII(documentText)
      if (!piiResult.success) {
        console.error(`[geminiHandler] PII redaction failed for rule ${ruleId}. Aborting Gemini request safely.`)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({
          verdict: 'unclear',
          evidence: 'PII redaction failed prior to AI evaluation. Manual review required.',
          reasoning: 'PII redactor error.'
        }))
      }

      const safeText = piiResult.redactedText
      console.log(`[PII Redactor] Rule: ${ruleId || 'N/A'} | Orig Len: ${piiResult.stats.originalLength} | Redacted Len: ${piiResult.stats.redactedLength} | Emails: ${piiResult.stats.emails} | Phones: ${piiResult.stats.phones} | Accounts: ${piiResult.stats.accounts}`)

      const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash'
      const ai = new GoogleGenAI({ apiKey })

      const userPrompt = `
RULE ID: ${ruleId || 'N/A'}
REGULATORY REQUIREMENT (${clauseReference || 'RBI Circular'}):
${requirement || 'Evaluate compliance.'}

---
DOCUMENT EVIDENCE / TEXT:
${safeText.slice(0, 10000)}
`.trim()

      const response = await generateContentWithRetry(ai, {
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              verdict: { type: 'STRING', enum: ['pass', 'fail', 'unclear'] },
              evidence: { type: 'STRING' },
              reasoning: { type: 'STRING' },
            },
            required: ['verdict', 'evidence', 'reasoning'],
          },
          temperature: 0.1,
          maxOutputTokens: 512,
        },
      }, ruleId)

      const responseText = response.text || '{}'
      let parsed = { verdict: 'unclear', evidence: 'No evidence generated.', reasoning: '' }
      try {
        parsed = JSON.parse(responseText)
      } catch (e) {
        console.warn(`[geminiHandler] Failed to parse JSON response for ${ruleId}:`, responseText)
      }

      const verdict = ['pass', 'fail', 'unclear'].includes(parsed.verdict) ? parsed.verdict : 'unclear'
      const evidence = parsed.evidence || parsed.reasoning || 'No evidence returned.'
      const reasoning = parsed.reasoning || ''

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ verdict, evidence, reasoning }))
    } catch (err) {
      console.error(`[geminiHandler] Error processing Gemini request for rule:`, err.message)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({
        verdict: 'unclear',
        evidence: `AI check encountered an error (${err.message}). Manual review required.`,
        reasoning: err.message
      }))
    }
  })
}
