import { useGame } from '../context/GameContext.jsx'
import NightAgentCard from './NightAgentCard.jsx'
import AchievementPanel from './AchievementPanel.jsx'

export default function RightPanel() {
  const { state } = useGame()

  const unlockedCount = state.achievements.filter(a => a.unlocked).length
  const totalCount = state.achievements.length

  return (
    <aside className="right-panel">
      <NightAgentCard />

      <div className="panel-card">
        <div className="panel-title">Achievements {unlockedCount}/{totalCount}</div>
        <AchievementPanel />
      </div>
    </aside>
  )
}
