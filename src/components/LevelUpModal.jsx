import { useEffect } from 'react'
import { useGame } from '../context/GameContext.jsx'

export default function LevelUpModal() {
  const { levelUpData, setLevelUpData } = useGame()

  useEffect(() => {
    if (levelUpData) {
      const timer = setTimeout(() => setLevelUpData(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [levelUpData, setLevelUpData])

  if (!levelUpData) return null

  return (
    <div className="level-up-overlay" onClick={() => setLevelUpData(null)}>
      <div className="level-up-modal" onClick={e => e.stopPropagation()}>
        <div className="level-up-label">⚔️ LEVEL UP ⚔️</div>
        <div className="level-up-num">{levelUpData.level}</div>
        <div className="level-up-sub">Total XP: {levelUpData.xp.toLocaleString()}</div>
        <button className="level-up-btn" onClick={() => setLevelUpData(null)}>
          Keep Crushing It ⚔️
        </button>
      </div>
    </div>
  )
}
