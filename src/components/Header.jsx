import { useGame } from '../context/GameContext.jsx'
import { levelProgress } from '../utils/gameLogic.js'
import EnergyBar from './EnergyBar.jsx'

export default function Header() {
  const { state, dispatch } = useGame()
  const { player } = state
  const progress = levelProgress(player.xp)

  function handleNameChange(e) {
    const newName = e.target.value.trim()
    if (newName) dispatch({ type: 'UPDATE_PLAYER_NAME', name: newName })
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">QUESTLOG</div>

        <div className="level-badge">
          <div className="level-num">Lv.{progress.level}</div>
          <div className="level-bar-outer">
            <div className="level-bar-inner" style={{ width: `${progress.progress * 100}%` }} />
          </div>
        </div>

        <div className="stat-pill">
          <span className="label">XP</span>
          <span className="value cyan">{player.xp}</span>
        </div>

        <div className="energy-widget">
          <span style={{ fontSize: '1.1rem' }}>⚡</span>
          <EnergyBar current={player.energy} max={player.maxEnergy} />
        </div>

        <div className="stat-pill">
          <span style={{ fontSize: '0.9rem' }}>🔥</span>
          <span className="value green">{player.streak}</span>
        </div>

        <div className="stat-pill">
          <span className="label">Gold</span>
          <span className="value gold">{player.gold.toLocaleString()}</span>
        </div>

        <div className="header-player">
          <span className="player-name" title="Click to edit name">
            <input
              type="text"
              defaultValue={player.name}
              onBlur={handleNameChange}
              onKeyDown={e => { if (e.key === 'Enter') e.target.blur() }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.8rem',
                width: `${Math.max(60, player.name.length * 8)}px`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </span>
        </div>
      </div>
    </header>
  )
}
