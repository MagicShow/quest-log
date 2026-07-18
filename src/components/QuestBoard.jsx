import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import QuestCard from './QuestCard.jsx'
import NewQuestForm from './NewQuestForm.jsx'

export default function QuestBoard({ activeProject }) {
  const { state } = useGame()
  const [showForm, setShowForm] = useState(false)

  const pending = state.quests.filter(q => !q.completed && (!activeProject || q.project === activeProject))
  const completed = state.quests.filter(q => q.completed && (!activeProject || q.project === activeProject))

  const today = new Date().toISOString().split('T')[0]
  const todayStats = state.dailyStats[today]

  return (
    <main className="quest-board">
      <div className="quest-board-header">
        <div className="quest-board-title">
          Today&apos;s Missions
          <span>
            {todayStats ? `${todayStats.completed} done` : 'no activity yet'}
            {todayStats?.xpGained ? ` · +${todayStats.xpGained} XP` : ''}
          </span>
        </div>
        <button className="new-quest-btn" onClick={() => setShowForm(!showForm)}>
          <span>{showForm ? '✕' : '+'}</span>
          {showForm ? 'Cancel' : 'New Quest'}
        </button>
      </div>

      {showForm && <NewQuestForm defaultProject={activeProject} onClose={() => setShowForm(false)} />}

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-card-icon">⚔️</span>
          <div className="stat-card-info">
            <span className="stat-card-value">{pending.length}</span>
            <span className="stat-card-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">✅</span>
          <div className="stat-card-info">
            <span className="stat-card-value">{completed.length}</span>
            <span className="stat-card-label">Done</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">⚡</span>
          <div className="stat-card-info">
            <span className="stat-card-value">{state.player.energy}</span>
            <span className="stat-card-label">Energy</span>
          </div>
        </div>
      </div>

      {pending.length === 0 && completed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚔️</div>
          <p>No quests yet. Add one and start leveling up.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="quest-list">
              {pending.map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <>
              <div className="sidebar-title" style={{ marginTop: 8 }}>
                Completed ({completed.length})
              </div>
              <div className="quest-list">
                {completed.map(quest => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
