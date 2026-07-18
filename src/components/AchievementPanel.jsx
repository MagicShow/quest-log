import { useGame } from '../context/GameContext.jsx'

export default function AchievementPanel() {
  const { state } = useGame()

  return (
    <div className="achievement-grid">
      {state.achievements.map(ach => (
        <div key={ach.id} className={`achievement-badge ${ach.unlocked ? 'unlocked' : ''}`}>
          <div className="ach-icon">{ach.icon}</div>
          <div className="ach-name">{ach.name}</div>
          <div className="ach-tooltip">
            <div className="ach-title">{ach.unlocked ? '🏆 ' : '🔒 '}{ach.name}</div>
            <div className="ach-desc">{ach.description}</div>
            {ach.unlocked && ach.unlockedAt && (
              <div style={{ fontSize: '0.6rem', color: 'var(--success)', marginTop: 4 }}>
                Earned {new Date(ach.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
