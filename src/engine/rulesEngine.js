// ─────────────────────────────────────────────────────────────────
//  rulesEngine.js  —  Document-checker & App-checker logic
//
//  Loads src/rules.json and iterates over document_rules / app_rules.
//  For each rule, applies the decision tree:
//
//  automation_level   check_type        → action
//  ─────────────────  ────────────────  ────────────────────────────
//  automatable        permission_list   → deterministic code
//  automatable        <anything else>   → Gemini LLM call
//  partially_automatable  <any>         → LLM / heuristic but status
//                                         forced to "unclear" + notes
//  not_automatable    <any>             → "not_verifiable", no score
//
//  Scope exemption: DL-02* rules are SKIPPED for exempt loan types.
// ─────────────────────────────────────────────────────────────────

import rulesData       from '../rules.json'
import { evaluateRule } from './geminiClient.js'

// ── Constants ────────────────────────────────────────────────────
export const EXEMPT_LOAN_TYPES = [
  'Credit Card',
  'ECB',
  'Trade Credit',
  'Structured Obligation',
]

const DL02_FAMILY_PREFIX = 'DL-02'

// ── Shared result builder ─────────────────────────────────────────
function makeResult(rule, status, evidence, extra = {}) {
  return {
    id:              rule.id,
    family:          rule.family ?? null,
    category:        rule.category,
    rule:            rule.requirement,
    reference:       rule.clause_reference,
    status,
    evidence,
    automationLevel: rule.automation_level,
    checkType:       rule.check_type ?? 'n/a',
    partialFlag:     rule.automation_level === 'partially_automatable',
    partialReason:   rule.automation_level === 'partially_automatable' ? (rule.notes ?? '') : null,
    ...extra,
  }
}

// ── Permission-list checker (pure code, no AI) ────────────────────
/**
 * @param {string[]} manifestPermissions - e.g. ["READ_CONTACTS","CAMERA"]
 * @param {string[]} bannedPerms         - rule.banned_permissions
 * @param {string[]} watchPerms          - rule.watch_permissions
 * @param {object}   rule
 */
function checkPermissionList(rule, manifestPermissions) {
  const banned = rule.banned_permissions ?? []
  const watch  = rule.watch_permissions  ?? []

  const foundBanned = banned.filter(p => manifestPermissions.includes(p))
  const foundWatch  = watch.filter(p => manifestPermissions.includes(p))

  if (banned.length > 0) {
    // banned_permissions → any match = FAIL
    if (foundBanned.length > 0) {
      return makeResult(rule, 'fail',
        `Banned permission(s) detected in AndroidManifest: ${foundBanned.join(', ')}. ` +
        `These are explicitly prohibited under ${rule.clause_reference}.`
      )
    }
    return makeResult(rule, 'pass',
      `None of the banned permissions (${banned.join(', ')}) found in the app's declared permissions. ✓`
    )
  }

  if (watch.length > 0) {
    // watch_permissions → presence flagged as unclear (partial by design)
    if (foundWatch.length > 0) {
      return makeResult(rule, 'unclear',
        `Sensitive permission(s) detected: ${foundWatch.join(', ')}. ` +
        `Presence is flagged — whether usage is limited to one-time KYC/onboarding with explicit consent cannot be verified from the manifest alone.`,
        { partialFlag: true, partialReason: rule.notes ?? 'One-time vs persistent usage not determinable from manifest.' }
      )
    }
    return makeResult(rule, 'pass',
      `Watch-listed permission(s) (${watch.join(', ')}) not declared in manifest. ✓`
    )
  }

  return makeResult(rule, 'unclear', 'No permission list specified in rule; manual check required.')
}

// ── Single rule dispatcher ────────────────────────────────────────
async function processRule(rule, { documentText, manifestPermissions, privacyPolicyText, loanType }) {
  // 1. Scope exemption check
  if (rule.id.startsWith(DL02_FAMILY_PREFIX) && EXEMPT_LOAN_TYPES.includes(loanType)) {
    return makeResult(rule, 'skipped',
      `Rule skipped: DL-02 family does not apply to ${loanType} loan type per RBI_2023_PENAL scope exclusion.`,
      { partialFlag: false, partialReason: null }
    )
  }

  // 2. not_automatable → skip entirely
  if (rule.automation_level === 'not_automatable') {
    return makeResult(rule, 'not_verifiable',
      rule.notes ?? 'Cannot be verified from available evidence alone.',
      { partialFlag: false, partialReason: null }
    )
  }

  // 3. automatable + permission_list → pure code
  if (rule.automation_level === 'automatable' && rule.check_type === 'permission_list') {
    return checkPermissionList(rule, manifestPermissions)
  }

  // 4. automatable OR partially_automatable → LLM call
  //    Choose the correct context text based on rule category
  const textForLLM = rule.category === 'app'
    ? (privacyPolicyText ?? '')
    : (documentText ?? '')

  const { verdict, evidence } = await evaluateRule(
    rule.id,
    rule.requirement,
    rule.clause_reference,
    textForLLM
  )

  // 5. If partially_automatable, force verdict to "unclear" regardless of LLM output
  const finalStatus = rule.automation_level === 'partially_automatable' ? 'unclear' : verdict

  return makeResult(rule, finalStatus, evidence)
}

// ─────────────────────────────────────────────────────────────────
//  Public API
// ─────────────────────────────────────────────────────────────────

/**
 * Run all document_rules against extracted document text.
 *
 * @param {string} documentText     - PII-redacted PDF text
 * @param {string} loanType         - e.g. "Personal Loan" | "Credit Card" | …
 * @returns {Promise<RuleResult[]>}
 */
export async function runDocumentChecker(documentText = '', loanType = 'Personal Loan') {
  const rules   = rulesData.document_rules
  const context = { documentText, manifestPermissions: [], privacyPolicyText: '', loanType }

  // Run all rules concurrently (Gemini calls are independent)
  return Promise.all(rules.map(rule => processRule(rule, context)))
}

/**
 * Run all app_rules against manifest permissions + privacy policy text.
 *
 * @param {string[]} manifestPermissions - Array of Android permission strings
 * @param {string}   privacyPolicyText  - Privacy policy page text
 * @param {string}   loanType           - Loan type (for scope exemption; usually N/A for app rules)
 * @returns {Promise<RuleResult[]>}
 */
export async function runAppChecker(
  manifestPermissions = [],
  privacyPolicyText   = '',
  loanType            = 'Personal Loan'
) {
  const rules   = rulesData.app_rules
  const context = { documentText: '', manifestPermissions, privacyPolicyText, loanType }

  return Promise.all(rules.map(rule => processRule(rule, context)))
}

/**
 * Compute the compliance score from a result set.
 * not_verifiable and skipped rules are excluded from the denominator.
 *
 * @param {RuleResult[]} results
 * @returns {{ pass, fail, unclear, notVerifiable, skipped, scoreable, score }}
 */
export function computeScore(results) {
  const pass          = results.filter(r => r.status === 'pass').length
  const fail          = results.filter(r => r.status === 'fail').length
  const unclear       = results.filter(r => r.status === 'unclear').length
  const notVerifiable = results.filter(r => r.status === 'not_verifiable').length
  const skipped       = results.filter(r => r.status === 'skipped').length
  const scoreable     = pass + fail + unclear
  const score         = scoreable > 0 ? Math.round((pass / scoreable) * 100) : 0

  return { pass, fail, unclear, notVerifiable, skipped, scoreable, score }
}
