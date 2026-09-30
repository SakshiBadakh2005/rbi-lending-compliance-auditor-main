import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Download, Share2, RefreshCw,
  FileText, Smartphone, Search,
  CheckCircle2, XCircle, AlertTriangle,
  Info, Ban, MinusCircle, ShieldCheck
} from 'lucide-react'
import AppShell from '../components/AppShell.jsx'
import ScoreCard from '../components/ScoreCard.jsx'
import RuleCard from '../components/RuleCard.jsx'
import {
  mockScanMeta,
  mockDocumentRules,
  mockAppRules,
} from '../mockData.js'

const TABS = [
  { id: 'document', label: 'Document Compliance', icon: FileText },
  { id: 'app',      label: 'App Compliance',       icon: Smartphone },
]

function SectionSummaryBar({ rules }) {
  const pass          = rules.filter(r => r.status === 'pass').length
  const fail          = rules.filter(r => r.status === 'fail').length
  const unclear       = rules.filter(r => r.status === 'unclear').length
  const notVerifiable = rules.filter(r => r.status === 'not_verifiable').length
  const skipped       = rules.filter(r => r.status === 'skipped').length
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12.5 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#15803D', fontWeight: 600 }}>
        <CheckCircle2 size={14}/> {pass} Passed
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#991B1B', fontWeight: 600 }}>
        <XCircle size={14}/> {fail} Failed
      </span>
      {unclear > 0 && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#92400E', fontWeight: 600 }}>
          <AlertTriangle size={14}/> {unclear} Unclear
        </span>
      )}
      {notVerifiable > 0 && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748B', fontWeight: 600 }}>
          <Ban size={14}/> {notVerifiable} Not verifiable
        </span>
      )}
      {skipped > 0 && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94A3B8', fontWeight: 600 }}>
          <MinusCircle size={14}/> {skipped} Skipped
        </span>
      )}
    </div>
  )
}

const FILTER_OPTIONS = [
  { key: 'all',            label: 'All Rules' },
  { key: 'pass',           label: 'Passed' },
  { key: 'fail',           label: 'Failed' },
  { key: 'unclear',        label: 'Unclear' },
  { key: 'not_verifiable', label: 'Not Verifiable' },
  { key: 'skipped',        label: 'Skipped' },
]

function FilterBar({ filter, setFilter, rules, search, setSearch }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600, marginRight: 4 }}>Filter Status:</span>
        {FILTER_OPTIONS.map(({ key, label }) => {
          const count = key === 'all' ? rules.length : rules.filter(r => r.status === key).length
          if (count === 0 && key !== 'all') return null

          const isActive = filter === key
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ height: 32, fontSize: 12 }}
            >
              {label}
              <span style={{ marginLeft: 4, opacity: 0.8, fontSize: 11 }}>({count})</span>
            </button>
          )
        })}
      </div>

      <div className="search-wrap" style={{ width: 220 }}>
        <Search size={14} color="#94A3B8" />
        <input
          type="text"
          placeholder="Search rule ID or wording..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input search-input"
          style={{ height: 32, fontSize: 12.5 }}
        />
      </div>
    </div>
  )
}

function ScoreFootnote({ rules }) {
  const notVerifiable = rules.filter(r => r.status === 'not_verifiable').length
  const skipped       = rules.filter(r => r.status === 'skipped').length
  if (notVerifiable === 0 && skipped === 0) return null
  return (
    <div style={{ fontSize: 12, color: '#64748B', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '8px 14px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
      <Info size={14} color="#2563EB" />
      <span>
        Score denominator excludes {notVerifiable > 0 ? <strong>{notVerifiable} not-verifiable rule(s)</strong> : ''}
        {notVerifiable > 0 && skipped > 0 ? ' and ' : ''}
        {skipped > 0 ? <strong>{skipped} skipped rule(s)</strong> : ''} per RBI circular scope exclusions.
      </span>
    </div>
  )
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('document')
  const [docFilter, setDocFilter] = useState('all')
  const [appFilter, setAppFilter] = useState('all')
  const [docSearch, setDocSearch] = useState('')
  const [appSearch, setAppSearch] = useState('')

  const stateData     = location.state
  const hasEngineData = !!(stateData?.docResults && stateData?.appResults)

  const docRules = hasEngineData ? stateData.docResults : mockDocumentRules
  const appRules = hasEngineData ? stateData.appResults : mockAppRules

  let totalRules, passCount, failCount, unclearCount,
      documentName, appName, scannedAt, scanId, loanType

  if (hasEngineData) {
    const { scoreData, scanMeta } = stateData
    totalRules   = scoreData.scoreable
    passCount    = scoreData.pass
    failCount    = scoreData.fail
    unclearCount = scoreData.unclear
    documentName = scanMeta.documentName
    appName      = scanMeta.appName
    scannedAt    = scanMeta.scannedAt
    scanId       = scanMeta.scanId
    loanType     = scanMeta.loanType
  } else {
    ;({ totalRules, passCount, failCount, unclearCount,
        documentName, appName, scannedAt, scanId, loanType } = mockScanMeta)
  }

  const allRules = [...docRules, ...appRules]

  const filterRules = (rules, filter, search) => {
    return rules.filter(r => {
      const matchFilter = filter === 'all' || r.status === filter
      const matchSearch = !search ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.rule.toLowerCase().includes(search.toLowerCase()) ||
        (r.evidence && r.evidence.toLowerCase().includes(search.toLowerCase()))
      return matchFilter && matchSearch
    })
  }

  const visibleDocRules = filterRules(docRules, docFilter, docSearch)
  const visibleAppRules = filterRules(appRules, appFilter, appSearch)

  return (
    <AppShell
      pageTitle={`Executive Compliance Audit Report (${scanId})`}
      pageSubtitle={`Evaluated on ${scannedAt} · Loan Product: ${loanType}`}
      breadcrumbs={[{ label: 'Audit History', path: '/dashboard' }, { label: scanId }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Action Toolbar & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-info" style={{ fontSize: 12 }}>Official Audit Report</span>
            <span style={{ fontSize: 13, color: '#64748B' }}>· RBI Digital Lending Framework 2025</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Download size={14}/> Export PDF Report
            </button>
            <button className="btn btn-secondary btn-sm">
              <Share2 size={14}/> Share Audit
            </button>
            <button
              onClick={() => navigate('/audit/new')}
              className="btn btn-primary btn-sm"
            >
              <RefreshCw size={14}/> Run New Audit
            </button>
          </div>
        </div>

        {/* Hero Score Card Section */}
        <div>
          <ScoreCard
            total={totalRules}
            pass={passCount}
            fail={failCount}
            unclear={unclearCount}
            docName={documentName}
            appName={appName}
            scannedAt={scannedAt}
            scanId={scanId}
          />
          <ScoreFootnote rules={allRules} />
        </div>

        {/* Critical Failures Banner */}
        {failCount > 0 && (
          <div style={{ display: 'flex', gap: 14, padding: '16px 20px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10 }}>
            <XCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#991B1B', margin: '0 0 4px' }}>
                {failCount} Regulatory Compliance Failure{failCount !== 1 ? 's' : ''} Identified
              </h4>
              <p style={{ fontSize: 13, color: '#B91C1C', margin: 0, lineHeight: 1.5 }}>
                Failed rule checks requiring immediate remediation: <strong>{allRules.filter(r => r.status === 'fail').map(r => r.id).join(', ')}</strong>. Inspect evidence quotes below.
              </p>
            </div>
          </div>
        )}

        {/* Tab Selection Navigation */}
        <div className="card card-p" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const rules = tab.id === 'document' ? docRules : appRules
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 8, height: 38 }}
                >
                  <Icon size={16} />
                  {tab.label} ({rules.length} Rules)
                </button>
              )
            })}
          </div>

          {activeTab === 'document' && (
            <FilterBar
              filter={docFilter}
              setFilter={setDocFilter}
              rules={docRules}
              search={docSearch}
              setSearch={setDocSearch}
            />
          )}
          {activeTab === 'app' && (
            <FilterBar
              filter={appFilter}
              setFilter={setAppFilter}
              rules={appRules}
              search={appSearch}
              setSearch={setAppSearch}
            />
          )}
        </div>

        {/* Rule Cards List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {activeTab === 'document' ? 'Document Verification Rule Engine Results' : 'App Permission & Privacy Policy Audit Results'}
            </h3>
            <SectionSummaryBar rules={activeTab === 'document' ? docRules : appRules} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTab === 'document' && visibleDocRules.length === 0 && (
              <div className="card card-p text-center" style={{ padding: 40, color: '#64748B' }}>
                No document rules matched your search or status filter.
              </div>
            )}
            {activeTab === 'document' && visibleDocRules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))}

            {activeTab === 'app' && visibleAppRules.length === 0 && (
              <div className="card card-p text-center" style={{ padding: 40, color: '#64748B' }}>
                No app rules matched your search or status filter.
              </div>
            )}
            {activeTab === 'app' && visibleAppRules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
