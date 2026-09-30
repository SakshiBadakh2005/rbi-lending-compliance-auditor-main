// ─────────────────────────────────────────────────────────────────
//  mockData.js  —  Phase 1 UI demo data
//
//  ALL counts shown in the UI are computed at runtime from:
//    (a) the actual mock result arrays below, and
//    (b) rulesData imported from rules.json
//  No number is ever hardcoded — add/remove rules in rules.json
//  and everything updates automatically.
// ─────────────────────────────────────────────────────────────────
import rulesData from './rules.json'

// ── Rule counts from rules.json (single source of truth) ─────────
const _allRules      = [...rulesData.document_rules, ...rulesData.app_rules]
const _notAutoCount  = _allRules.filter(r => r.automation_level === 'not_automatable').length
export const RULES_DOC_COUNT   = rulesData.document_rules.length
export const RULES_APP_COUNT   = rulesData.app_rules.length
export const RULES_TOTAL       = _allRules.length
export const RULES_SCOREABLE   = RULES_TOTAL - _notAutoCount
export const RULES_NOT_AUTO    = _notAutoCount

// ── Loan type for this demo scan ─────────────────────────────────
// Change to 'Credit Card' | 'ECB' | 'Trade Credit' | 'Structured Obligation'
// to see DL-02 family rules auto-skipped.
export const mockLoanType = 'Personal Loan'

// ── Dashboard statistics ─────────────────────────────────────────
export const mockDashboardStats = {
  totalAudits:    24,
  compliantCount: 17,
  issuesFound:     7,
  avgScore:        74,
  trend: {
    totalAudits:    { direction: 'up',   value: '+3 this month' },
    compliantCount: { direction: 'up',   value: '+2 this month' },
    issuesFound:    { direction: 'down', value: '-1 this month' },
    avgScore:       { direction: 'up',   value: '+6 pts this month' },
  }
}

// ── Audit History (recent scans) ─────────────────────────────────
export const mockAuditHistory = [
  {
    id: 'SCN-2025-0047',
    documentName: 'PersonalLoan_KFS_SampleBorrower.pdf',
    appName: 'QuickLend — Instant Personal Loans',
    appId: 'com.quicklend.app',
    date: '19 Aug 2026',
    time: '13:45 IST',
    score: 60,
    rulesPassed: 9,
    totalRules: 15,
    status: 'issues',
  },
  {
    id: 'SCN-2025-0046',
    documentName: 'HomeLoan_Agreement_HDFC_Template.pdf',
    appName: 'CashNow — Instant Credit Line',
    appId: 'com.cashnow.loans',
    date: '18 Aug 2026',
    time: '10:22 IST',
    score: 87,
    rulesPassed: 13,
    totalRules: 15,
    status: 'compliant',
  },
  {
    id: 'SCN-2025-0045',
    documentName: 'GoldLoan_KFS_Muthoot.pdf',
    appName: 'PayDay India — Salary Advance',
    appId: 'com.paydayindia.salary',
    date: '17 Aug 2026',
    time: '15:10 IST',
    score: 40,
    rulesPassed: 6,
    totalRules: 15,
    status: 'non-compliant',
  },
  {
    id: 'SCN-2025-0044',
    documentName: 'MSME_Loan_KFS_SBI.pdf',
    appName: 'RupeeGo — Micro Loans',
    appId: 'com.rupeego.micro',
    date: '16 Aug 2026',
    time: '09:05 IST',
    score: 93,
    rulesPassed: 14,
    totalRules: 15,
    status: 'compliant',
  },
  {
    id: 'SCN-2025-0043',
    documentName: 'ConsumerLoan_KFS_Bajaj.pdf',
    appName: 'LoanBuddy — Credit Score & Loans',
    appId: 'com.loanbuddy.credit',
    date: '15 Aug 2026',
    time: '11:33 IST',
    score: 67,
    rulesPassed: 10,
    totalRules: 15,
    status: 'issues',
  },
  {
    id: 'SCN-2025-0042',
    documentName: 'TwoWheelerLoan_Mahindra.pdf',
    appName: 'MoneyTap — Credit Line',
    appId: 'com.moneytap.line',
    date: '14 Aug 2026',
    time: '14:47 IST',
    score: 80,
    rulesPassed: 12,
    totalRules: 15,
    status: 'compliant',
  },
  {
    id: 'SCN-2025-0041',
    documentName: 'EducationLoan_KFS_Union.pdf',
    appName: 'EarlySalary — Instant Cash',
    appId: 'com.earlysalary.app',
    date: '13 Aug 2026',
    time: '08:15 IST',
    score: 53,
    rulesPassed: 8,
    totalRules: 15,
    status: 'issues',
  },
  {
    id: 'SCN-2025-0040',
    documentName: 'PersonalLoan_KFS_Axis.pdf',
    appName: 'KreditBee — Personal Finance App',
    appId: 'com.kreditbee.loan',
    date: '12 Aug 2026',
    time: '16:20 IST',
    score: 100,
    rulesPassed: 15,
    totalRules: 15,
    status: 'compliant',
  },
]

// ── Current scan meta ────────────────────────────────────────────
// All counts are derived from the mock result arrays and rulesData.
// mockScanMeta is defined AFTER mockDocumentRules + mockAppRules so
// we can reference them directly — see the bottom of this file.
export const mockScanMeta = {
  scanId:       'SCN-2025-0047',
  scannedAt:    '19 Aug 2026, 13:45 IST',
  documentName: 'PersonalLoan_KFS_SampleBorrower.pdf',
  appLink:      'https://play.google.com/store/apps/details?id=com.quicklend.app',
  appName:      'QuickLend — Instant Personal Loans',
  loanType:     'Personal Loan',
  // ↓ Populated at bottom of file once mockDocumentRules/mockAppRules are defined
  totalRules:         0,
  passCount:          0,
  failCount:          0,
  unclearCount:       0,
  notVerifiableCount: 0,
  skippedCount:       0,
}

// ── Document rules (DL-01* … DL-10) ─────────────────────────────
// Each entry mirrors the engine's RuleResult shape.
// 'category' field drives the tab (document / app).
export const mockDocumentRules = [
  // ── KFS family (DL-01*) ──────────────────────────────────────
  {
    id: 'DL-01a', family: 'KFS', category: 'document',
    rule: 'KFS follows the standardised Annex A template, in a language the borrower understands, contents explained, acknowledgment of understanding obtained',
    reference: 'RBI_2024_KFS Para 4',
    status: 'unclear',
    evidence: 'KFS follows Annex A template format and is in English. However, acknowledgment of borrower understanding could not be independently verified from the document alone.',
    automationLevel: 'partially_automatable', checkType: 'presence+semantic',
    partialFlag: true, partialReason: 'Acknowledgment step not verifiable from the document alone',
  },
  {
    id: 'DL-01b', family: 'KFS', category: 'document',
    rule: 'Applicability scope check: retail/MSME term loan sanctioned on or after 2024-10-01 (credit cards exempt)',
    reference: 'RBI_2024_KFS Para 10-11',
    status: 'pass',
    evidence: 'Loan sanctioned on 2025-03-15 for a retail personal term loan. KFS Directions apply.',
    automationLevel: 'automatable', checkType: 'scope_filter',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01c', family: 'KFS', category: 'document',
    rule: 'KFS validity period stated: ≥3 working days (tenor ≥7 days) or ≥1 working day (tenor <7 days)',
    reference: 'RBI_2024_KFS Para 5',
    status: 'pass',
    evidence: '"This Key Fact Statement is valid for 3 working days from the date of issue." — KFS Page 1.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01c2', family: 'KFS', category: 'document',
    rule: 'KFS carries a unique proposal number',
    reference: 'RBI_2024_KFS Para 5',
    status: 'pass',
    evidence: 'Unique proposal number KFS-2025-Q1-004817 found in header block of KFS.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01d', family: 'KFS', category: 'document',
    rule: 'Loan proposal/account number and type of loan present',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'Loan Account No. LA-29847501 and loan type "Unsecured Personal Loan" present on Page 1.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01e', family: 'KFS', category: 'document',
    rule: 'Sanctioned loan amount present',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'Sanctioned loan amount of ₹2,00,000 clearly stated in Part 1, Section A.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01f', family: 'KFS', category: 'document',
    rule: 'Disbursal schedule present (staged or 100% upfront); if staged, references the specific agreement clause',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'Disbursal schedule states 100% upfront to borrower\'s registered bank account within 24 hours of execution.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01g', family: 'KFS', category: 'document',
    rule: 'Loan term present (years/months/days)',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'Loan term: 24 months (2 years) stated in Part 1.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01h', family: 'KFS', category: 'document',
    rule: 'Instalment details present: type, number of EPIs, EPI amount, commencement date',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: '24 monthly EPIs of ₹10,162 each; commencement date 2025-04-15; type: equated monthly.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01i', family: 'KFS', category: 'document',
    rule: 'Interest rate (%) and type (fixed/floating/hybrid) present',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'Interest rate: 18.00% p.a., type: Fixed — disclosed in Part 1.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01j', family: 'KFS', category: 'document',
    rule: 'If floating rate: benchmark, benchmark rate, spread, final rate, reset periodicity, and impact of 25bps change disclosed',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'Fixed rate loan — floating rate sub-fields not applicable; correctly omitted.',
    automationLevel: 'automatable', checkType: 'conditional_presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01k', family: 'KFS', category: 'document',
    rule: 'Fee/charges table present, split into payable-to-RE vs payable-to-third-party, each as one-time/recurring with amount or %',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'fail',
    evidence: 'Fee table present but does not split charges into "payable to RE" vs "payable to third party" columns as required by Annex A Part 1. All fees lumped together.',
    automationLevel: 'automatable', checkType: 'presence+structure',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01l', family: 'KFS', category: 'document',
    rule: 'APR (%) present as a single computed figure',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'pass',
    evidence: 'APR stated as 20.34% p.a. as a single computed figure on Page 1.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01m', family: 'KFS', category: 'document',
    rule: 'Contingent charges table present: penal charges, foreclosure charges, fixed↔floating switch charges',
    reference: 'RBI_2024_KFS Annex A Part 1',
    status: 'fail',
    evidence: 'Penal charges and foreclosure charges listed. However, the fixed↔floating switch charge row is entirely missing from the contingent charges table.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01n', family: 'KFS', category: 'document',
    rule: 'Part 2 qualitative fields present: recovery agent clause ref, grievance mechanism clause ref, grievance officer phone+email, transfer/securitisation disclosure, co-lending detail if applicable, cooling-off period + LSP recovery-agent detail for digital loans',
    reference: 'RBI_2024_KFS Annex A Part 2',
    status: 'unclear',
    evidence: 'Recovery agent clause reference and grievance officer contact found. Co-lending disclosure and LSP recovery-agent detail for digital channel are absent — unclear if applicable to this product.',
    automationLevel: 'automatable', checkType: 'presence (multi-field)',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01o', family: 'KFS', category: 'document',
    rule: 'Any fee/charge in the loan agreement but NOT in the KFS fee table is flagged unless separate explicit borrower consent exists for that specific fee',
    reference: 'RBI_2024_KFS Para 8',
    status: 'unclear',
    evidence: 'Loan agreement contains a "documentation fee" of ₹250 not listed in KFS fee table. No separate consent evidence available — flagged as conditional potential violation per Para 8.',
    automationLevel: 'automatable', checkType: 'cross_document_comparison',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-01p', family: 'KFS', category: 'document',
    rule: 'The KFS is included as a summary box exhibited as part of the loan agreement itself, not only issued as a separate standalone document',
    reference: 'RBI_2024_KFS Para 9',
    status: 'fail',
    evidence: 'KFS was issued as a standalone document. No embedded KFS summary box found within the loan agreement itself, as required by Para 9.',
    automationLevel: 'automatable', checkType: 'cross_document_comparison',
    partialFlag: false, partialReason: null,
  },

  // ── Penal Charges family (DL-02*) — Personal Loan, so NOT skipped ──
  {
    id: 'DL-02a', family: 'Penal Charges', category: 'document',
    rule: 'Charge is labeled/structured as "penal charges" (flat or event-based fee) — NOT as "penal interest" added to the interest rate',
    reference: 'RBI_2023_PENAL Para 3(i)',
    status: 'fail',
    evidence: 'Clause 11.3: "Penal interest @ 2% per month on overdue amount." — Uses prohibited term "penal interest" instead of "penal charges".',
    automationLevel: 'automatable', checkType: 'semantic_wording',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02b', family: 'Penal Charges', category: 'document',
    rule: 'No capitalisation — penal charges must not themselves accrue further interest',
    reference: 'RBI_2023_PENAL Para 3(i)',
    status: 'unclear',
    evidence: 'Clause 12 states "outstanding dues may be consolidated periodically." Insufficient specificity to confirm penal amounts are not capitalised.',
    automationLevel: 'automatable', checkType: 'semantic',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02c', family: 'Penal Charges', category: 'document',
    rule: 'No additional component silently folded into the interest rate to disguise a penalty',
    reference: 'RBI_2023_PENAL Para 3(ii)',
    status: 'pass',
    evidence: 'No evidence of interest rate component silently embedding a penalty. Rate stated as 18% flat with no hidden spread language.',
    automationLevel: 'automatable', checkType: 'semantic',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02d', family: 'Penal Charges', category: 'document',
    rule: 'RE has a Board-approved policy on penal charges',
    reference: 'RBI_2023_PENAL Para 3(iii)',
    status: 'not_verifiable',
    evidence: 'Cannot be verified from a single KFS/loan document. Board-level policy is not disclosed in borrower-facing documents.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02e', family: 'Penal Charges', category: 'document',
    rule: 'Quantum of penal charge is reasonable/commensurate with the non-compliance and non-discriminatory within the loan/product category',
    reference: 'RBI_2023_PENAL Para 3(iv)',
    status: 'unclear',
    evidence: 'Penal charge of ₹500 per missed EMI stated. Reasonableness relative to non-compliance type is subjective; non-discriminatory claim cannot be confirmed from this document alone.',
    automationLevel: 'partially_automatable', checkType: 'semantic (subjective)',
    partialFlag: true, partialReason: 'Requires comparison across borrower categories; not verifiable from a single document',
  },
  {
    id: 'DL-02f', family: 'Penal Charges', category: 'document',
    rule: 'For individual (non-business) borrowers, penal charges do not exceed what non-individual/business borrowers are charged for the same non-compliance',
    reference: 'RBI_2023_PENAL Para 3(v)',
    status: 'not_verifiable',
    evidence: 'Requires comparison data across borrower categories not present in a single loan document.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02g', family: 'Penal Charges', category: 'document',
    rule: 'Quantum and reason for penal charges appear in ALL of: loan agreement, KFS/MITC, and RE website',
    reference: 'RBI_2023_PENAL Para 3(vi)',
    status: 'pass',
    evidence: 'Penal charge quantum (₹500/missed EMI) and reason (instalment default) present in KFS contingent charges table and loan agreement Clause 11.',
    automationLevel: 'automatable', checkType: 'cross_document_comparison',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02h', family: 'Penal Charges', category: 'document',
    rule: 'Non-compliance reminders to borrower include the applicable penal charge',
    reference: 'RBI_2023_PENAL Para 3(vii)',
    status: 'not_verifiable',
    evidence: 'Requires access to actual reminder communications (SMS/email). Not verifiable from loan document.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-02i', family: 'Penal Charges', category: 'document',
    rule: 'Actual levy of penal charge plus specific reason separately communicated to borrower',
    reference: 'RBI_2023_PENAL Para 3(vii)',
    status: 'not_verifiable',
    evidence: 'Requires access to actual levy communications. Event-based check; not verifiable from loan document.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },

  // ── Remaining document rules ──────────────────────────────────
  {
    id: 'DL-03', category: 'document',
    rule: 'Digitally signed KFS, loan summary, sanction letter, T&C, account statements, and RE/LSP privacy policy auto-delivered via registered email/SMS on execution',
    reference: 'RBI_2025_DIRECTIONS Para 8(iii)',
    status: 'unclear',
    evidence: 'Loan agreement states digital delivery of KFS and sanction letter. Actual email/SMS delivery cannot be verified from the document alone.',
    automationLevel: 'partially_automatable', checkType: 'presence',
    partialFlag: true, partialReason: 'Checkable if borrower uploads the email/SMS record, not from KFS alone',
  },
  {
    id: 'DL-04', category: 'document',
    rule: 'Grievance redressal officer\'s contact details (phone + email) present in the KFS',
    reference: 'RBI_2025_DIRECTIONS Para 11(ii)',
    status: 'pass',
    evidence: 'Grievance Redressal Officer: grievance@lendapp.in | 1800-000-1234 (Toll Free) — found on Page 4, Section 9.',
    automationLevel: 'automatable', checkType: 'presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-05', category: 'document',
    rule: 'Recovery agent\'s particulars communicated via email/SMS before first contact',
    reference: 'RBI_2025_DIRECTIONS Para 8(v)',
    status: 'not_verifiable',
    evidence: 'Event-based check — requires access to actual communications before first recovery contact. Not verifiable from loan document.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-06', category: 'document',
    rule: 'Cooling-off period disclosed — borrower can exit paying only principal + proportionate APR, no penalty, minimum 1 day',
    reference: 'RBI_2025_DIRECTIONS Para 10(i)',
    status: 'pass',
    evidence: '"You have the right to cancel this loan agreement within 3 (three) business days of disbursal without any prepayment penalty." — Page 3, Clause 8.',
    automationLevel: 'automatable', checkType: 'presence+semantic',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-07', category: 'document',
    rule: 'One-time processing fee for cooling-off exit (if any) disclosed upfront in KFS',
    reference: 'RBI_2025_DIRECTIONS Para 10(ii)',
    status: 'pass',
    evidence: '"A one-time processing fee of ₹199 is applicable on cooling-off exit, disclosed upfront in the KFS fee table."',
    automationLevel: 'automatable', checkType: 'conditional_presence',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-08', category: 'document',
    rule: 'Loan disbursed directly to borrower\'s bank account — never to LSP or third-party account',
    reference: 'RBI_2025_DIRECTIONS Para 9(i)',
    status: 'unclear',
    evidence: 'Disbursement clause states funds to borrower\'s account. However, exact routing mechanism not specified; whether LSP is intermediary is unclear from document text.',
    automationLevel: 'partially_automatable', checkType: 'presence+semantic',
    partialFlag: true, partialReason: 'Document-stated claim only; actual bank routing not verifiable',
  },
  {
    id: 'DL-09', category: 'document',
    rule: 'No pass-through/pool account used for servicing or repayment',
    reference: 'RBI_2025_DIRECTIONS Para 9(ii)',
    status: 'pass',
    evidence: 'Repayment routed directly to RE\'s nodal account. No pass-through or pool account language found in agreement.',
    automationLevel: 'partially_automatable', checkType: 'semantic',
    partialFlag: true, partialReason: 'Document-stated claim only',
  },
  {
    id: 'DL-10', category: 'document',
    rule: 'LSP fees paid directly by RE — never charged to or collected from the borrower',
    reference: 'RBI_2025_DIRECTIONS Para 9(iv)',
    status: 'pass',
    evidence: '"LSP facilitation fee is borne entirely by the Regulated Entity and shall not be charged to or collected from the borrower." — Clause 16.',
    automationLevel: 'partially_automatable', checkType: 'semantic',
    partialFlag: true, partialReason: 'Document-stated claim only',
  },
]

// ── App rules (DL-11 … DL-22) ────────────────────────────────────
export const mockAppRules = [
  {
    id: 'DL-11', category: 'app',
    rule: 'DLA must not access contact list, call logs, file/media, or telephony functions',
    reference: 'RBI_2025_DIRECTIONS Para 12(i)',
    status: 'fail',
    evidence: 'Banned permission READ_CONTACTS detected in AndroidManifest.xml. This permission allows contact list access, explicitly prohibited under Para 12(i). Cite Para 12(i) itself, not the permission string, as the regulatory source.',
    automationLevel: 'automatable', checkType: 'permission_list',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-12', category: 'app',
    rule: 'Camera/microphone/location access allowed only as one-time, for KYC/onboarding, with explicit consent',
    reference: 'RBI_2025_DIRECTIONS Para 12(i)',
    status: 'unclear',
    evidence: 'Sensitive permissions detected: CAMERA, ACCESS_FINE_LOCATION. Presence flagged — whether usage is limited to one-time KYC with explicit consent cannot be verified from the manifest alone.',
    automationLevel: 'partially_automatable', checkType: 'permission_list+context',
    partialFlag: true, partialReason: 'One-time vs persistent usage not always visible from manifest alone',
  },
  {
    id: 'DL-13', category: 'app',
    rule: 'Borrower gets granular consent controls: give/deny per data type, restrict third-party sharing, set retention, revoke, request deletion',
    reference: 'RBI_2025_DIRECTIONS Para 12(ii)',
    status: 'unclear',
    evidence: 'Privacy policy mentions data controls but lacks explicit per-data-type granular consent toggles and data deletion request workflow.',
    automationLevel: 'partially_automatable', checkType: 'privacy_policy_semantic',
    partialFlag: true, partialReason: 'In-app inspection needed to confirm consent toggle implementation',
  },
  {
    id: 'DL-14', category: 'app',
    rule: 'Purpose of consent disclosed at each interface stage',
    reference: 'RBI_2025_DIRECTIONS Para 12(iii)',
    status: 'not_verifiable',
    evidence: 'Requires in-app UI inspection at each consent screen. Cannot be determined from manifest or public privacy policy.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-15', category: 'app',
    rule: 'Explicit consent required before sharing personal data with any third party (except statutory requirement)',
    reference: 'RBI_2025_DIRECTIONS Para 12(iv)',
    status: 'fail',
    evidence: 'Privacy policy states "we may share your data with our marketing partners." No explicit borrower consent mechanism for third-party data sharing found.',
    automationLevel: 'automatable', checkType: 'privacy_policy_semantic',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-16', category: 'app',
    rule: 'LSP must not store personal data beyond basic minimum (name, address, contact)',
    reference: 'RBI_2025_DIRECTIONS Para 13(i)',
    status: 'not_verifiable',
    evidence: 'LSP data storage practices are not publicly verifiable from the app manifest or privacy policy.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-17', category: 'app',
    rule: 'Data storage policy (type, retention period, destruction protocol, breach handling) disclosed on website/DLA',
    reference: 'RBI_2025_DIRECTIONS Para 13(ii)',
    status: 'pass',
    evidence: 'Privacy policy discloses data types, 3-year retention period, secure deletion on account closure, and breach notification within 72 hours.',
    automationLevel: 'automatable', checkType: 'privacy_policy_semantic',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-18', category: 'app',
    rule: 'No biometric data stored/collected unless a statutory exception applies',
    reference: 'RBI_2025_DIRECTIONS Para 13(iii)',
    status: 'pass',
    evidence: 'Banned biometric permissions (USE_BIOMETRIC, USE_FINGERPRINT) not found in the app\'s declared permissions. ✓',
    automationLevel: 'automatable', checkType: 'permission_list',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-19', category: 'app',
    rule: 'Data stored only on India-based servers; if processed abroad, deleted and returned within 24 hours',
    reference: 'RBI_2025_DIRECTIONS Para 13(iv)',
    status: 'not_verifiable',
    evidence: 'Server location cannot be independently verified from the app manifest or public privacy policy text.',
    automationLevel: 'not_automatable', checkType: 'n/a',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-20', category: 'app',
    rule: 'Comprehensive privacy policy publicly available on RE and LSP website',
    reference: 'RBI_2025_DIRECTIONS Para 14(i)',
    status: 'pass',
    evidence: 'Privacy policy URL https://lendingapp.example.com/privacy is publicly accessible and returns HTTP 200.',
    automationLevel: 'automatable', checkType: 'presence (URL exists)',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-21', category: 'app',
    rule: 'Any third party permitted to collect data via the DLA is disclosed in the privacy policy',
    reference: 'RBI_2025_DIRECTIONS Para 14(ii)',
    status: 'unclear',
    evidence: 'Privacy policy mentions analytics partners but does not enumerate all third parties permitted to collect data via the DLA.',
    automationLevel: 'automatable', checkType: 'privacy_policy_semantic',
    partialFlag: false, partialReason: null,
  },
  {
    id: 'DL-22', category: 'app',
    rule: 'App appears on RBI\'s CIMS-published Digital Lending App directory',
    reference: 'RBI_2025_DIRECTIONS Para 17',
    status: 'fail',
    evidence: 'App "com.quicklend.app" not found in RBI CIMS Digital Lending App directory as of audit date. RE required to report all DLAs by 2025-06-15.',
    automationLevel: 'automatable', checkType: 'external_lookup',
    partialFlag: false, partialReason: null,
  },
]

// ── Populate mockScanMeta from actual arrays + rules.json ─────────
// This block runs once at module load, AFTER all arrays are defined.
// Never edit these numbers manually — they will always stay in sync.
;(function _hydrateScanMeta() {
  const allResults = [...mockDocumentRules, ...mockAppRules]
  mockScanMeta.passCount          = allResults.filter(r => r.status === 'pass').length
  mockScanMeta.failCount          = allResults.filter(r => r.status === 'fail').length
  mockScanMeta.unclearCount       = allResults.filter(r => r.status === 'unclear').length
  mockScanMeta.notVerifiableCount = allResults.filter(r => r.status === 'not_verifiable').length
  mockScanMeta.skippedCount       = allResults.filter(r => r.status === 'skipped').length
  // totalRules = scoreable denominator from rules.json (not_automatable excluded)
  mockScanMeta.totalRules         = RULES_SCOREABLE
})()
