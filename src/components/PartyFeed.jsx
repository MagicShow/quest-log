import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'

export default function PartyFeed() {
  const { state } = useGame()
  const feed = state.partyFeed || []
  const prevFeedLength = useRef(feed.length)
  const feedRef = useRef(null)

  // Scroll to top when new items appear (newest first)
  useEffect(() => {
    if (feed.length > prevFeedLength.current && feedRef.current) {
      feedRef.current.scrollTop = 0
    }
    prevFeedLength.current = feed.length
  }, [feed.length])

  if (feed.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="panel-card">
          <div className="panel-title">⚡ Party Feed</div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            textAlign: 'center',
            padding: '20px 0',
            lineHeight: 1.5,
          }}>
            No activity yet. Complete quests to see your party's achievements here.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="panel-card">
        <div className="panel-title">⚡ Party Feed</div>
        <div
          ref={feedRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {feed.slice(0, 20).map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px',
                background: i === 0 && feed.length > prevFeedLength.current
                  ? 'var(--success-dim)'
                  : 'var(--bg-deep)',
                border: `1px solid ${i === 0 && feed.length > prevFeedLength.current ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                animation: i === 0 ? 'feedPop 0.4s ease' : 'none',
                transition: 'background 0.3s, border-color 0.3s',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚔️</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.userName}</span>
                  {' completed '}
                  <span style={{ color: 'var(--text-primary)' }}>{item.questTitle}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(item.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
