// ─────────────────────────────────────────────────────────────────
//  geminiClient.js  —  Thin Gemini REST wrapper with sequential queue
//
//  Set VITE_GEMINI_API_KEY in .env.local to enable real AI calls.
//  When the key is absent (or VITE_MOCK_ENGINE=true), all calls
//  return a simulated deterministic response based on a hash of
//  the rule ID — good enough for UI demos.
//
//  Rate-limiting: all real API calls are serialised through a
//  promise-chain queue with a 15-second inter-request delay,
//  targeting ≤4 requests/minute (free-tier limit: 5/min).
// ─────────────────────────────────────────────────────────────────

const MOCK_MODE = import.meta.env.VITE_MOCK_ENGINE === 'true'

// ── Sequential request queue ───────────────────────────────────────
// Prevents concurrent Gemini API calls from exhausting the free-tier
// rate limit (5 req/min for gemini-3.6-flash).
// All evaluateRule() calls are serialised through a single promise chain.
// A 15-second inter-request delay targets ≤4 requests/minute.
const INTER_REQUEST_DELAY_MS = 15_000

let _chainTail = Promise.resolve()

/**
 * Enqueues taskFn to run only after all previously enqueued tasks
 * have settled AND the inter-request delay has elapsed.
 * @param {() => Promise<any>} taskFn
 * @returns {Promise<any>}
 */
function _enqueue(taskFn) {
  const slot = _chainTail.then(() => taskFn())
  // Advance the chain tail: after slot settles (pass OR fail),
  // wait INTER_REQUEST_DELAY_MS before the next task may begin.
  _chainTail = slot
    .catch(() => { })  // swallow so the chain never stalls on error
    .then(() => new Promise(resolve => setTimeout(resolve, INTER_REQUEST_DELAY_MS)))
  return slot
}

/**
 * Ask Gemini to evaluate whether documentText satisfies requirement.
 * Calls server-side /api/gemini endpoint securely without exposing API keys.
 *
 * Requests are serialised through _enqueue so they execute one at a time
 * with a 15-second pause between completions (≤4 req/min free-tier safe).
 *
 * @param {string} ruleId           - e.g. "DL-01c"
 * @param {string} requirement      - Full requirement text from rules.json
 * @param {string} clauseReference  - e.g. "RBI_2024_KFS Para 5"
 * @param {string} documentText     - Extracted (PII-redacted) document text
 * @returns {Promise<{ verdict: 'pass'|'fail'|'unclear', evidence: string }>}
 */
export async function evaluateRule(ruleId, requirement, clauseReference, documentText) {
  if (MOCK_MODE) {
    return _mockResponse(ruleId, requirement)
  }

  return _enqueue(async () => {
    const start = Date.now()
    console.log(`[geminiClient] Rule: ${ruleId} | Request started`)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleId,
          requirement,
          clauseReference,
          documentText,
        }),
      })

      const elapsed = Date.now() - start
      if (!res.ok) {
        const errText = await res.text()
        console.warn(`[geminiClient] Rule: ${ruleId} | HTTP ${res.status} | Elapsed: ${elapsed}ms | Error: ${errText.slice(0, 120)}`)
        return {
          verdict: 'unclear',
          evidence: `AI check could not complete (server HTTP ${res.status}). Manual review required.`,
        }
      }

      const data = await res.json()
      console.log(`[geminiClient] Rule: ${ruleId} | Request completed | Elapsed: ${elapsed}ms | Verdict: ${data.verdict} | Evidence length: ${data.evidence?.length ?? 0}`)

      return {
        verdict: ['pass', 'fail', 'unclear'].includes(data.verdict) ? data.verdict : 'unclear',
        evidence: data.evidence ?? 'No evidence returned.',
      }
    } catch (err) {
      const elapsed = Date.now() - start
      console.warn(`[geminiClient] Rule: ${ruleId} | Network/parse error | Elapsed: ${elapsed}ms | Error: ${err.message}`)
      return {
        verdict: 'unclear',
        evidence: `AI check failed (${err.message}). Manual review required.`,
      }
    }
  })
}

// ── Mock deterministic responses ──────────────────────────────────
// Produces a stable, realistic-looking result per rule ID for demos.
const MOCK_VERDICTS = {
  'DL-01a': { verdict: 'unclear', evidence: '[Demo] KFS follows Annex A template format. However, acknowledgment of borrower understanding could not be independently verified from the document alone.' },
  'DL-01b': { verdict: 'pass', evidence: '[Demo] Loan sanctioned on 2025-03-15 for retail term loan. KFS rules apply.' },
  'DL-01c': { verdict: 'pass', evidence: '[Demo] "This Key Fact Statement is valid for 3 working days from the date of issue." — KFS Page 1.' },
  'DL-01c2': { verdict: 'pass', evidence: '[Demo] Unique proposal number KFS-2025-Q1-004817 found in header block of KFS.' },
  'DL-01d': { verdict: 'pass', evidence: '[Demo] Loan Account No. LA-29847501 and loan type "Unsecured Personal Loan" present on Page 1.' },
  'DL-01e': { verdict: 'pass', evidence: '[Demo] Sanctioned loan amount of ₹2,00,000 clearly stated in Part 1, Section A.' },
  'DL-01f': { verdict: 'pass', evidence: '[Demo] Disbursal schedule states 100% upfront to borrower\'s registered bank account within 24 hours of execution.' },
  'DL-01g': { verdict: 'pass', evidence: '[Demo] Loan term: 24 months (2 years) stated in Part 1.' },
  'DL-01h': { verdict: 'pass', evidence: '[Demo] 24 monthly EPIs of ₹10,162 each; commencement date 2025-04-15; type: equated monthly.' },
  'DL-01i': { verdict: 'pass', evidence: '[Demo] Interest rate: 18.00% p.a., fixed type, disclosed in Part 1.' },
  'DL-01j': { verdict: 'pass', evidence: '[Demo] Fixed rate loan — floating rate sub-fields not applicable; correctly omitted.' },
  'DL-01k': { verdict: 'fail', evidence: '[Demo] Fee table present but does not split charges into "payable to RE" vs "payable to third party" columns as required by Annex A Part 1.' },
  'DL-01l': { verdict: 'pass', evidence: '[Demo] APR stated as 20.34% p.a. as a single computed figure on Page 1.' },
  'DL-01m': { verdict: 'fail', evidence: '[Demo] Penal charges table present; foreclosure charge listed. However, fixed↔floating switch charge row is entirely missing from the contingent charges table.' },
  'DL-01n': { verdict: 'unclear', evidence: '[Demo] Recovery agent clause reference and grievance officer contact found. Co-lending disclosure and LSP recovery-agent detail for digital channel are absent — unclear if applicable.' },
  'DL-01o': { verdict: 'unclear', evidence: '[Demo] Loan agreement contains a "documentation fee" of ₹250 not listed in KFS fee table. No separate consent evidence available — flagged as conditional potential violation.' },
  'DL-01p': { verdict: 'fail', evidence: '[Demo] KFS was issued as a standalone document. No embedded KFS summary box found within the loan agreement itself, as required by Para 9.' },
  'DL-02a': { verdict: 'fail', evidence: '[Demo] Clause 11.3: "Penal interest @ 2% per month on overdue amount." — Uses prohibited term "penal interest" instead of "penal charges".' },
  'DL-02b': { verdict: 'unclear', evidence: '[Demo] Clause 12 states "outstanding dues may be consolidated periodically." Insufficient specificity to confirm penal amounts are not capitalised.' },
  'DL-02c': { verdict: 'pass', evidence: '[Demo] No evidence of interest rate component silently embedding a penalty. Rate is stated as 18% flat with no hidden spread language.' },
  'DL-02e': { verdict: 'unclear', evidence: '[Demo] Penal charge of ₹500 per missed EMI stated. Reasonableness relative to non-compliance type is subjective and not definitively verifiable from this document.' },
  'DL-02g': { verdict: 'pass', evidence: '[Demo] Quantum and reason for penal charges present in KFS fee/contingent charges table.' },
  'DL-03': { verdict: 'unclear', evidence: '[Demo] Loan agreement states digital delivery of KFS and sanction letter. However, actual email/SMS delivery cannot be verified from the document alone.' },
  'DL-04': { verdict: 'pass', evidence: '[Demo] Grievance Redressal Officer: grievance@lendapp.in | 1800-000-1234 (Toll Free) — found on Page 4, Section 9.' },
  'DL-06': { verdict: 'pass', evidence: '[Demo] Cooling-off period of 3 working days disclosed on Page 3, Clause 8. Exit terms: principal + proportionate APR, no penalty.' },
  'DL-07': { verdict: 'pass', evidence: '[Demo] "A one-time processing fee of ₹199 is applicable on cooling-off exit, disclosed upfront in the KFS fee table."' },
  'DL-08': { verdict: 'pass', evidence: '[Demo] Disbursement clause states funds transferred directly to borrower\'s savings account; no LSP or pool account mentioned.' },
  'DL-09': { verdict: 'pass', evidence: '[Demo] Repayment routed directly to RE\'s nodal account. No pass-through or pool account language found.' },
  'DL-10': { verdict: 'pass', evidence: '[Demo] "LSP facilitation fee is borne entirely by the Regulated Entity and shall not be charged to or collected from the borrower." — Clause 16.' },
  // app rules with non-permission check_type
  'DL-13': { verdict: 'unclear', evidence: '[Demo] Privacy policy mentions data controls but lacks explicit per-data-type granular consent toggles and data deletion request workflow.' },
  'DL-15': { verdict: 'fail', evidence: '[Demo] Privacy policy states "we may share your data with our marketing partners." No explicit borrower consent mechanism for third-party sharing found.' },
  'DL-17': { verdict: 'pass', evidence: '[Demo] Privacy policy discloses data types collected, 3-year retention period, secure deletion on account closure, and breach notification within 72 hours.' },
  'DL-20': { verdict: 'pass', evidence: '[Demo] Privacy policy URL https://lendingapp.example.com/privacy is publicly accessible and returns HTTP 200.' },
  'DL-21': { verdict: 'unclear', evidence: '[Demo] Privacy policy mentions analytics partners but does not enumerate all third parties permitted to collect data via the DLA.' },
  'DL-22': { verdict: 'fail', evidence: '[Demo] App not found in RBI CIMS Digital Lending App directory as of audit date. This is an independent red flag.' },
}

function _mockResponse(ruleId, _requirement) {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve(
        MOCK_VERDICTS[ruleId] ?? {
          verdict: 'unclear',
          evidence: `[Demo] Automated check for ${ruleId} returned inconclusive result. Manual review recommended.`,
        }
      )
    }, 80 + Math.random() * 120)   // simulate slight latency
  )
}
