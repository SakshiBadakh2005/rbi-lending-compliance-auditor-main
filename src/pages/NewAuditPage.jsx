import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Smartphone, Info, Shield, Clock, Lock, CheckCircle2, ChevronDown, Upload, X } from 'lucide-react'
import AppShell from '../components/AppShell.jsx'
import FileUploadZone from '../components/FileUploadZone.jsx'
import { EXEMPT_LOAN_TYPES } from '../engine/rulesEngine.js'
import { RULES_TOTAL, RULES_DOC_COUNT, RULES_APP_COUNT } from '../mockData.js'

const LOAN_TYPES = [
  'Personal Loan',
  'MSME Loan',
  'Home Loan',
  'Gold Loan',
  'Education Loan',
  'Consumer Loan',
  'Two-Wheeler Loan',
  ...EXEMPT_LOAN_TYPES,
]

const CHECKS_DOC = [
  'DL-01* — KFS Annex A completeness (17 sub-fields)',
  'DL-01k — Fee/charges table split (RE vs third-party)',
  'DL-01l — APR as single computed figure',
  'DL-01o — KFS vs loan agreement fee cross-check',
  'DL-01p — KFS summary box embedded in loan agreement',
  'DL-02* — Penal charge wording & capitalisation (Para 3)',
  'DL-04  — Grievance Redressal Officer details',
  'DL-06  — Cooling-off period (min. 1 day)',
  'DL-08–10 — Disbursement, pool accounts, LSP fees',
]

const CHECKS_APP = [
  'DL-11 — Banned permissions (READ_CONTACTS, READ_CALL_LOG, READ_SMS…)',
  'DL-12 — Sensitive permissions (CAMERA, LOCATION, MICROPHONE)',
  'DL-13 — Granular consent controls in privacy policy',
  'DL-15 — Explicit consent for third-party data sharing',
  'DL-17 — Data storage & retention policy disclosure',
  'DL-18 — Biometric permission check (USE_BIOMETRIC)',
  'DL-20 — Privacy policy publicly accessible (URL check)',
  'DL-22 — App on RBI CIMS Digital Lending App directory',
]

export default function NewAuditPage() {
  const [file, setFile]           = useState(null)
  const [appLink, setAppLink]     = useState('')
  const [linkError, setLinkError] = useState('')
  const [loanType, setLoanType]   = useState('Personal Loan')
  const navigate = useNavigate()

  const isExempt = EXEMPT_LOAN_TYPES.includes(loanType)
  const isValidLink = (v) => v.includes('play.google.com/store/apps/details')

  const handleLinkChange = (e) => {
    const v = e.target.value
    setAppLink(v)
    if (v && !isValidLink(v)) {
      setLinkError('Must be a valid Google Play Store URL (play.google.com/store/apps/details?id=…)')
    } else {
      setLinkError('')
    }
  }

  const canSubmit = !!file && isValidLink(appLink)

  const handleStart = () => {
    if (!canSubmit) return
    navigate('/audit/analyzing', { state: { file, appLink, loanType } })
  }

  return (
    <AppShell
      pageTitle="New Compliance Audit"
      pageSubtitle="Evaluate a digital lending application & Key Fact Statement against 39+ RBI regulatory requirements"
      breadcrumbs={[{ label: 'New Audit' }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Audit Intake Stepper with connecting line */}
        <div className="card card-p" style={{ padding: '20px 28px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {/* Background track line */}
            <div style={{
              position: 'absolute', top: 17, left: '6%', right: '6%',
              height: 2, background: '#E2E8F0', borderRadius: 99, zIndex: 0
            }} />
            {/* Filled progress line */}
            {(() => {
              const steps = [!!file, isValidLink(appLink), true, canSubmit]
              const completedCount = steps.filter(Boolean).length
              const pct = Math.max(0, ((completedCount - 1) / (steps.length - 1)) * 100)
              return (
                <motion.div
                  style={{
                    position: 'absolute', top: 17, left: '6%',
                    height: 2, background: '#2563EB', borderRadius: 99, zIndex: 1
                  }}
                  animate={{ width: `${pct * 0.88}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              )
            })()}

            {[
              { num: '01', title: 'Upload Document', desc: 'Key Fact Statement (PDF)', done: !!file },
              { num: '02', title: 'App Details', desc: 'Google Play Store URL', done: isValidLink(appLink) },
              { num: '03', title: 'Loan Scope', desc: loanType, done: true },
              { num: '04', title: 'Execute Audit', desc: 'Run Rules Engine', done: canSubmit },
            ].map(({ num, title, desc, done }, i) => (
              <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 2, flex: 1 }}>
                <motion.div
                  animate={{
                    background: done ? '#2563EB' : '#F1F5F9',
                    color: done ? '#FFFFFF' : '#64748B',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, flexShrink: 0,
                    border: done ? '2px solid #2563EB' : '2px solid #E2E8F0',
                    boxShadow: done ? '0 0 0 4px rgba(37,99,235,0.12)' : 'none',
                  }}
                >
                  {done ? <CheckCircle2 size={18} /> : num}
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: done ? '#0F172A' : '#64748B', margin: 0 }}>{title}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0', maxWidth: 100 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Form Left + Rules Sidebar Right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          
          {/* Left Form Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Step 1: Document Upload */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} color="#2563EB" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Step 1 — Loan Type & Document Upload</h2>
                  <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0' }}>Upload Key Fact Statement (KFS) or loan agreement PDF file</p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="label">Select Loan Product Type</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="input"
                    value={loanType}
                    onChange={e => setLoanType(e.target.value)}
                    style={{ paddingRight: 36, appearance: 'none', background: '#FFFFFF' }}
                  >
                    {LOAN_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} color="#94A3B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>

                {isExempt && (
                  <div style={{ fontSize: 12, color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: 8, marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <strong>Scope Exemption Note:</strong> DL-02 (Penal Charges) rules will be <strong>automatically skipped</strong> per RBI_2023_PENAL circular exclusions for {loanType}.
                    </div>
                  </div>
                )}
              </div>

              <FileUploadZone onFileChange={setFile} />
            </div>

            {/* Step 2: Application Details */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={18} color="#16A34A" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Step 2 — Digital Lending App (DLA) Details</h2>
                  <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0' }}>Enter Google Play Store URL of the lending application</p>
                </div>
              </div>

              <div>
                <label className="label">Google Play Store URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                  value={appLink}
                  onChange={handleLinkChange}
                />
                {linkError ? (
                  <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6, fontWeight: 500 }}>{linkError}</p>
                ) : (
                  <p style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>
                    Example test URL: <span style={{ fontFamily: 'monospace', color: '#2563EB', cursor: 'pointer' }} onClick={() => { setAppLink('https://play.google.com/store/apps/details?id=com.kreditbee.android'); setLinkError(''); }}>https://play.google.com/store/apps/details?id=com.kreditbee.android</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="card card-p" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#64748B' }}>
                <Lock size={16} color="#2563EB" />
                <span>Document text is processed locally and PII is automatically redacted before analysis.</span>
              </div>
              <button
                className="btn btn-primary btn-lg"
                disabled={!canSubmit}
                onClick={handleStart}
                style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
              >
                Start Compliance Audit <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Rules Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Document Rules Summary */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} color="#2563EB" />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>Document Rules</h3>
                </div>
                <span className="badge badge-info">{RULES_DOC_COUNT} rules</span>
              </div>
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {CHECKS_DOC.map(c => (
                  <li key={c} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* App Rules Summary */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={16} color="#16A34A" />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>App Rules</h3>
                </div>
                <span className="badge badge-pass">{RULES_APP_COUNT} rules</span>
              </div>
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {CHECKS_APP.map(c => (
                  <li key={c} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4 }}>
                    <Shield size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  )
}
