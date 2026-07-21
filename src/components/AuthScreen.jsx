import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthScreen() {
  const { login, signup } = useAuth()
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        if (!name.trim()) {
          setError('Hero name is required')
          setLoading(false)
          return
        }
        await signup(email, password, name)
        setError('')
        setLoading(false)
        setTab('login')
        setError('Account created! Check your email or log in now.')
        return
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-deep)',
      padding: '20px',
    }}>
      {/* Background grid effect */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        boxShadow: '0 0 60px rgba(0,229,255,0.1), 0 0 120px rgba(255,45,120,0.05)',
      }}>
        {/* Top border glow */}
        <div style={{
          position: 'absolute',
          top: 0, left: '20%', right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          borderRadius: '0 0 2px 2px',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}>
            QUESTLOG
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {tab === 'login' ? 'Welcome back, Hero' : 'Begin your journey'}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-deep)',
          borderRadius: 'var(--radius)',
          padding: '4px',
          marginBottom: '28px',
        }}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: tab === t ? 'var(--bg-elevated)' : 'transparent',
                color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: tab === t ? '0 0 12px rgba(0,229,255,0.2)' : 'none',
              }}
            >
              {t === 'login' ? 'LOGIN' : 'SIGN UP'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tab === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em' }}>
                HERO NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your hero name"
                style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="hero@questlog.com"
              required
              style={{
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--danger-dim)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '14px',
              background: loading ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--primary), #00B8D4)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--bg-deep)',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 20px rgba(0,229,255,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'LOADING...' : tab === 'login' ? 'ENTER THE REALM' : 'CREATE HERO'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {tab === 'login' ? 'New to QuestLog?' : 'Already have an account?'}{' '}
          <button
            onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError('') }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: 0,
            }}
          >
            {tab === 'login' ? 'Create account' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  )
}
