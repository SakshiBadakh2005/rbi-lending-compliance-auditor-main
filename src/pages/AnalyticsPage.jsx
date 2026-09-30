import { useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Download, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import AppShell from '../components/AppShell.jsx'

const MONTHLY = [
  { month: 'Mar', audits: 3,  score: 68 },
  { month: 'Apr', audits: 4,  score: 72 },
  { month: 'May', audits: 5,  score: 70 },
  { month: 'Jun', audits: 3,  score: 75 },
  { month: 'Jul', audits: 6,  score: 78 },
  { month: 'Aug', audits: 3,  score: 74 },
]

const RULE_PASS_RATES = [
  { rule: 'KFS Disclosure',      rate: 92, color: '#16A34A' },
  { rule: 'APR Calculation',     rate: 79, color: '#2563EB' },
  { rule: 'App Permissions',     rate: 65, color: '#D97706' },
  { rule: 'Grievance Redressal', rate: 88, color: '#16A34A' },
  { rule: 'Penal Charges',       rate: 54, color: '#DC2626' },
  { rule: 'Lender Disclosure',   rate: 95, color: '#16A34A' },
]

/* ── Animated bar for compliance matrix ──────────────────── */
function AnimBar({ rule, rate, color }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = `${rate}%` }))
  }, [rate])
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{rule}</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color }}>{rate}% Pass</span>
      </div>
      <div style={{ height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
        <div ref={ref} className="animated-bar" style={{ background: color }} />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {

  return (
    <AppShell
      pageTitle="Compliance Analytics & Risk Trends"
      pageSubtitle="Track compliance rates, audit volumes, and regulatory risk categories across time"
      breadcrumbs={[{ label: 'Analytics' }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Header Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>6-Month Portfolio Compliance Intelligence</span>
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export Analytics Report
          </button>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { label: 'Avg Score (6mo)', value: '73%', icon: BarChart3, color: '#2563EB', change: '+5% vs last period', isPos: true },
            { label: 'Compliance Trajectory', value: 'Rising', icon: TrendingUp, color: '#16A34A', change: '+8 pts overall', isPos: true },
            { label: 'Highest Risk Area', value: 'Penal Charges', icon: TrendingDown, color: '#DC2626', change: '54% pass rate', isPos: false },
            { label: 'Best Compliance', value: 'KFS Disclosure', icon: ShieldCheck, color: '#7C3AED', change: '92% pass rate', isPos: true },
          ].map(({ label, value, icon: Icon, color, change, isPos }) => (
            <div key={label} className="stat-card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="stat-label">{label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>{value}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpRight size={14} style={{ transform: isPos ? 'none' : 'rotate(90deg)' }} />
                {change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          {/* Monthly Audits Bar Chart — recharts */}
          <div className="card card-p">
            <div style={{ marginBottom: 20 }}>
              <h3 className="card-title">Monthly Audit Volume</h3>
              <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Number of completed digital lending audits per month</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MONTHLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(v) => [v + ' audits', 'Volume']}
                  cursor={{ fill: '#EFF6FF', radius: 4 }}
                />
                <Bar dataKey="audits" radius={[5, 5, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Trend Chart — recharts */}
          <div className="card card-p">
            <div style={{ marginBottom: 20 }}>
              <h3 className="card-title">Average Compliance Score Trajectory</h3>
              <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Average percentage score across evaluated lenders</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MONTHLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(v) => [v + '%', 'Avg Score']}
                  cursor={{ fill: '#F0FDF4', radius: 4 }}
                />
                <Bar dataKey="score" radius={[5, 5, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
                  {MONTHLY.map(({ score }, idx) => (
                    <Cell key={idx} fill={score >= 75 ? '#16A34A' : score >= 70 ? '#2563EB' : '#D97706'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Rule Pass Rates Category Matrix */}
        <div className="card card-p">
          <div style={{ marginBottom: 24 }}>
            <h3 className="card-title">Rule Category Compliance Matrix</h3>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Aggregate pass rates by specific RBI circular mandate category</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
            {RULE_PASS_RATES.map(({ rule, rate, color }) => (
              <AnimBar key={rule} rule={rule} rate={rate} color={color} />
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
