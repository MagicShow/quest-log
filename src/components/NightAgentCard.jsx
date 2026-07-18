import { useGame } from '../context/GameContext.jsx'
import { generateNightTip } from '../utils/gameLogic.js'

export default function NightAgentCard() {
  const { state, dispatch } = useGame()

  const latestTip = state.nightAgentTips[0]

  // Generate a tip on demand (night agent analysis)
  function handleRefreshTip() {
    const tip = generateNightTip(state)
    dispatch({ type: 'ADD_NIGHT_TIP', tip })
  }

  return (
    <div className="night-agent-card">
      <div className="night-agent-header">
        <span style={{ fontSize: '1.1rem' }}>🌙</span>
        <span className="night-agent-title">Night Agent</span>
      </div>

      {latestTip ? (
        <>
          <p className="night-agent-tip">{latestTip.tip}</p>
          <div className="night-agent-date">Generated {latestTip.date}</div>
        </>
      ) : (
        <p className="night-agent-tip" style={{ fontStyle: 'normal', color: 'var(--text-muted)' }}>
          Night Agent analyzes your patterns at 10 PM and delivers optimization tips here.
        </p>
      )}

      <button
        onClick={handleRefreshTip}
        style={{
          marginTop: 10,
          background: 'none',
          border: '1px solid rgba(255,45,120,0.3)',
          borderRadius: 6,
          padding: '5px 12px',
          color: 'var(--accent)',
          fontSize: '0.7rem',
          cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        🔄 Analyze Now
      </button>
    </div>
  )
}
