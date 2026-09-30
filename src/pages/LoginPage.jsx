import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('compliance.officer@digilend.io')
  const [password, setPassword] = useState('password123')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 400)
  }

  const fillDemo = () => {
    setEmail('compliance.officer@digilend.io')
    setPassword('password123')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F0F4F8' }}>

      {/* LEFT: Digital Lending Illustration — 70% */}
      <div style={{
        flex: '1 1 70%',
        background: 'linear-gradient(135deg, #DBEAFE 0%, #BAE6FD 50%, #E0F2FE 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        gap: 24,
      }}>
        <img
          src="/digital_lending_hero.jpg"
          alt="Digital Lending Compliance"
          style={{
            width: '100%',
            maxWidth: 580,
            borderRadius: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            objectFit: 'cover',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Automated RBI Compliance Auditor
          </h2>
          <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>
            39+ RBI rules · PDF extraction · AI-assisted analysis
          </p>
        </div>
      </div>

      {/* RIGHT: Form Panel — 30% */}
      <div style={{
        flex: '0 0 30%',
        minWidth: 320,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 40px',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, background: '#1E3A8A', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="white" />
          </div>
          <div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>DigiLend Audit</span>
            <span style={{ display: 'block', fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>RBI Compliance</span>
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Welcome Back!</h1>
          <p style={{ fontSize: 13.5, color: '#64748B', margin: 0 }}>Please enter your login details below.</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#991B1B', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="officer@bank.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
              autoComplete="email"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="label" style={{ margin: 0 }}>Password</label>
              <a href="#forgot" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                style={{ paddingRight: 40 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: 6, background: '#0F172A', borderColor: '#0F172A', borderRadius: 10 }}
          >
            {loading ? 'Signing in...' : <> Login <ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Demo Fill */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 8px' }}>Demo environment</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={fillDemo} style={{ width: '100%' }}>
            Auto-fill Demo Credentials
          </button>
        </div>

      </div>

    </div>
  )
}
