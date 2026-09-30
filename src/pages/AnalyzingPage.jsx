import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, FileText, Smartphone, Brain, ClipboardList, CheckCircle2 } from 'lucide-react'
import AppShell from '../components/AppShell.jsx'
import ProgressStep from '../components/ProgressStep.jsx'
import rulesData from '../rules.json'
import { runDocumentChecker, runAppChecker, computeScore } from '../engine/rulesEngine.js'
import { extractTextFromPDF } from '../utils/pdfExtractor.js'

const DOC_RULES      = rulesData.document_rules
const APP_RULES      = rulesData.app_rules
const ALL_RULES      = [...DOC_RULES, ...APP_RULES]
const DOC_COUNT      = DOC_RULES.length
const APP_COUNT      = APP_RULES.length
const TOTAL_COUNT    = ALL_RULES.length
const NOT_AUTO_COUNT = ALL_RULES.filter(r => r.automation_level === 'not_automatable').length
const SCOREABLE      = TOTAL_COUNT - NOT_AUTO_COUNT

const STEPS = [
  {
    label:    'Extracting document text & redacting PII',
    sublabel: 'pdfjs-dist text extraction — masking sensitive identifiers',
    icon:     FileText,
    duration: 900,
  },
  {
    label:    `Evaluating ${DOC_COUNT} document compliance rules`,
    sublabel: 'Evaluating KFS clauses, penal charges, cooling-off & grievance disclosures…',
    icon:     Brain,
    duration: 1400,
  },
  {
    label:    `Scanning ${APP_COUNT} app permission & privacy policy rules`,
    sublabel: 'Play Store manifest permissions (DL-11, DL-18) + privacy policy analysis…',
    icon:     Smartphone,
    duration: 900,
  },
  {
    label:    'Compiling executive compliance report',
    sublabel: `Reconciling document & app results across ${SCOREABLE} scoreable RBI rules`,
    icon:     ClipboardList,
    duration: 700,
  },
]

function generateScanId() {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `SCN-${year}-${rand}`
}

export default function AnalyzingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [pct, setPct]                 = useState(0)

  const { file, appLink, loanType = 'Personal Loan' } = location.state ?? {}

  useEffect(() => {
    const durations = STEPS.map(s => s.duration)
    const total     = durations.reduce((a, b) => a + b, 0) + 500

    const enginePromise = (async () => {
      let documentText = ''
      console.log('[PDF Extraction] File:', file?.name, file?.size)
      if (file) {
        try {
          documentText = await extractTextFromPDF(file)
          if (!documentText) {
            console.log('[PDF Extraction] WARNING: No text was extracted from the PDF.')
          } else {
            console.log('[PDF Extraction] Extracted character count:', documentText.length)
          }
        } catch (err) {
          console.error('[PDF Extraction] Error extracting PDF text:', err)
        }
      } else {
        console.log('[PDF Extraction] WARNING: No file object provided in navigation state.')
      }

      console.log('[PDF Extraction] Passing extracted text to document checker:', documentText.length)

      let manifestPermissions = []
      let privacyPolicyText = ''

      if (appLink) {
        try {
          const resp = await fetch(`/api/play-store?url=${encodeURIComponent(appLink)}`)
          const data = await resp.json()

          if (data.success) {
            manifestPermissions = data.permissions ?? []
            privacyPolicyText = data.privacyPolicyText ?? ''

            console.log('[Play Store] App ID:', data.appId)
            console.log('[Play Store] Retrieved permissions count:', manifestPermissions.length)
            console.log('[Play Store] Privacy policy URL:', data.privacyPolicyUrl)
            console.log('[Play Store] Privacy policy character count:', privacyPolicyText.length)
          } else {
            console.warn('[Play Store] WARNING: Play Store metadata fetch unsuccessful:', data.warnings?.join('; '))
          }
        } catch (err) {
          console.error('[Play Store] Error fetching Play Store details:', err)
        }
      } else {
        console.log('[Play Store] WARNING: No appLink provided in navigation state.')
      }

      return Promise.all([
        runDocumentChecker(documentText, loanType),
        runAppChecker(manifestPermissions, privacyPolicyText, loanType),
      ])
    })()

    const pctTimer = setInterval(() => {
      setPct(p => Math.min(p + 1, 99))
    }, total / 99)

    let cumulative = 0
    const timers = durations.map((dur, i) => {
      cumulative += dur
      return setTimeout(() => setActiveIndex(i + 1), cumulative)
    })

    const doneTimer = setTimeout(async () => {
      clearInterval(pctTimer)
      setPct(100)

      try {
        const [docResults, appResults] = await enginePromise
        const scoreData = computeScore([...docResults, ...appResults])

        const scanMeta = {
          scanId:       generateScanId(),
          scannedAt:    new Date().toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false,
          }) + ' IST',
          documentName: file?.name ?? 'Document (PDF extraction pending)',
          appName:      appLink    ?? 'App (Play Store analysis pending)',
          loanType:     loanType   ?? 'Personal Loan',
        }

        setTimeout(() => navigate('/audit/results', {
          state:   { docResults, appResults, scoreData, scanMeta },
          replace: true,
        }), 500)
      } catch (err) {
        console.error('[AnalyzingPage] Engine error:', err)
        setTimeout(() => navigate('/audit/results', {
          state:   { engineError: String(err?.message ?? err) },
          replace: true,
        }), 500)
      }
    }, cumulative + 400)

    return () => {
      clearInterval(pctTimer)
      timers.forEach(clearTimeout)
      clearTimeout(doneTimer)
    }
  }, [navigate, loanType])

  const currentStep = STEPS[Math.min(activeIndex, STEPS.length - 1)]
  const CurrentIcon = currentStep?.icon ?? ShieldCheck

  return (
    <AppShell
      pageTitle="Compliance Audit Execution"
      pageSubtitle="Evaluating lending application against RBI regulatory frameworks"
      breadcrumbs={[{ label: 'Audit Execution' }]}
    >
      <div style={{ maxWidth: 720, margin: '20px auto 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Main Processing Status Card */}
        <div className="card card-p" style={{ textAlign: 'center', padding: '40px 32px' }}>
          
          {/* Animated Spinner Ring */}
          <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 24px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #E2E8F0' }} />
            <div
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '4px solid #2563EB', borderTopColor: 'transparent',
                animation: 'spin 1.2s linear infinite'
              }}
            />
            <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CurrentIcon size={28} color="#2563EB" />
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
            Evaluating Compliance Requirements
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748B', margin: '0 0 24px' }}>
            Running {TOTAL_COUNT} rule checks ({DOC_COUNT} document + {APP_COUNT} app) across 3 RBI circulars for <strong>{loanType}</strong>
          </p>

          {/* Progress Bar */}
          <div style={{ width: '100%', background: '#E2E8F0', height: 8, borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
            <div
              style={{ height: '100%', background: '#2563EB', borderRadius: 99, width: `${pct}%`, transition: 'width 0.3s ease-out' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 28 }}>
            <span>{currentStep.label}</span>
            <span>{pct}% complete</span>
          </div>

          {/* Target Metadata Summary */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'left', fontSize: 12 }}>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Document:</span>
              <strong style={{ color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {file?.name ?? 'Sample KFS.pdf'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Application:</span>
              <strong style={{ color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {appLink ? 'Play Store Verified' : 'Standard App'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Loan Product:</span>
              <strong style={{ color: '#0F172A', display: 'block' }}>{loanType}</strong>
            </div>
          </div>
        </div>

        {/* Step-by-Step Progress Card */}
        <div className="card card-p">
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 20px' }}>
            Analysis Engine Execution
          </h3>
          <ProgressStep steps={STEPS} activeIndex={activeIndex} />
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AppShell>
  )
}
