import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

export default function PartyPanel() {
  const { state, dispatch } = useGame()
  const [joinCode, setJoinCode] = useState('')
  const [showJoin, setShowJoin] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const party = state.party
  const members = state.partyMembers || []

  async function handleCopyCode() {
    if (!party?.code) return
    await navigator.clipboard.writeText(party.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCreateParty() {
    setError('')
    try {
      await dispatch({ type: 'CREATE_PARTY' })
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleJoinParty() {
    if (!joinCode.trim()) return
    setError('')
    try {
      await dispatch({ type: 'JOIN_PARTY', code: joinCode.trim().toUpperCase() })
      setShowJoin(false)
      setJoinCode('')
    } catch (err) {
      setError(err.message || 'Failed to join party')
    }
  }

  async function handleLeaveParty() {
    setError('')
    try {
      await dispatch({ type: 'LEAVE_PARTY' })
    } catch (err) {
      setError(err.message || 'Failed to leave party')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Party Card */}
      <div className="panel-card">
        <div className="panel-title">⚔️ Party</div>

        {!party ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Team up with friends to tackle quests together and climb the leaderboard.
            </p>
            <button className="new-quest-btn" onClick={handleCreateParty}>
              Create Party
            </button>
            <button
              className="new-quest-btn"
              onClick={() => setShowJoin(!showJoin)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              {showJoin ? 'Cancel' : 'Join Party'}
            </button>
            {showJoin && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  maxLength={6}
                  style={{
                    flex: 1,
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  className="new-quest-btn"
                  onClick={handleJoinParty}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Join
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Party Code */}
            <div style={{
              background: 'var(--bg-deep)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '6px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>
                PARTY CODE
              </div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--primary)',
                textShadow: '0 0 20px rgba(0,229,255,0.4)',
              }}>
                {party.code}
              </div>
              <button
                onClick={handleCopyCode}
                style={{
                  marginTop: '8px',
                  background: copied ? 'var(--success-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${copied ? 'var(--success)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 12px',
                  color: copied ? 'var(--success)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? 'COPIED!' : 'Copy Code'}
              </button>
            </div>

            {/* Party Name */}
            {party.name && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                {party.name}
              </div>
            )}

            {/* Members */}
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '8px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em' }}>
                MEMBERS ({members.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {members.map(member => (
                  <div key={member.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    background: 'var(--bg-deep)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <span style={{ fontSize: '1rem' }}>🧙</span>
                    <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {member.name || 'Hero'}
                    </span>
                    {member.role === 'owner' && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontFamily: 'Orbitron, sans-serif' }}>
                        👑
                      </span>
                    )}
                    {member.role === 'member' && member.user_id === state.partyOwnerId && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontFamily: 'Orbitron, sans-serif' }}>
                        👑
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleLeaveParty}
              style={{
                background: 'var(--danger-dim)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px',
                color: 'var(--danger)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Leave Party
            </button>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '8px',
            padding: '8px 10px',
            background: 'var(--danger-dim)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger)',
            fontSize: '0.8rem',
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
