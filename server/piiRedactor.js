/**
 * PII Redactor for DigiLend Audit
 * Conservatively masks sensitive borrower identifiers before sending text to LLM.
 */

export function redactPII(text = '') {
  if (typeof text !== 'string') {
    return {
      redactedText: '',
      stats: { originalLength: 0, redactedLength: 0, emails: 0, phones: 0, accounts: 0 },
      success: false
    }
  }

  try {
    const originalLength = text.length
    let emailsCount = 0
    let phonesCount = 0
    let accountsCount = 0

    // 1. Email Redaction
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
    let redacted = text.replace(emailRegex, () => {
      emailsCount++
      return '[REDACTED_EMAIL]'
    })

    // 2. Indian Phone Numbers Redaction (10-digit numbers with optional country prefix)
    const phoneRegex = /(?:\+91[\s.-]?|91[\s.-]?|0)?\b[6-9]\d{9}\b/g
    redacted = redacted.replace(phoneRegex, () => {
      phonesCount++
      return '[REDACTED_PHONE]'
    })

    // 3. Account Numbers Redaction
    const accountRegex = /\b(?:A\/C|Account|Acc|A\/c)\s*(?:No|Number|\.|\#)?[:\s]*([0-9]{8,18})\b/gi
    redacted = redacted.replace(accountRegex, (match, p1) => {
      accountsCount++
      return match.replace(p1, '[REDACTED_ACCOUNT]')
    })

    return {
      redactedText: redacted,
      stats: {
        originalLength,
        redactedLength: redacted.length,
        emails: emailsCount,
        phones: phonesCount,
        accounts: accountsCount
      },
      success: true
    }
  } catch (err) {
    console.error('[piiRedactor] Error during redaction:', err.message)
    return {
      redactedText: '',
      stats: { originalLength: text.length, redactedLength: 0, emails: 0, phones: 0, accounts: 0 },
      success: false
    }
  }
}
