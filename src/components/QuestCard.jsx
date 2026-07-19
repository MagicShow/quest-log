import { useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'

const DIFFICULTY_PROGRESS = { easy: 5, medium: 10, hard: 15, epic: 20 }

export default function QuestCard({ quest }) {
  const { state, dispatch } = useGame()
  const cardRef = useRef(null)

  const project = state.projects.find(p => p.id === quest.project)
  const gw = state.gameWorld || {}

  // Map level to project
  const projectLevelMap = { 'life-admin': 1, 'home': 2, 'apps': 3, 'self': 4, 'family': 5 }
  const questLevel = projectLevelMap[quest.project]
  const isOnCurrentLevel = questLevel === gw.currentLevel

  function handleComplete(e) {
    e.stopPropagation()
    if (!quest.completed) {
      // Show XP animation
      const rect = cardRef.current?.getBoundingClientRect()
      if (rect) {
        const el = document.createElement('div')
        el.className = 'xp-pop'
        el.textContent = `+${quest.xpReward} XP`
        el.style.left = `${rect.left + rect.width / 2}px`
        el.style.top = `${rect.top}px`
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 1200)
      }
      dispatch({ type: 'COMPLETE_QUEST', id: quest.id })
      dispatch({ type: 'UPDATE_STREAK' })
      // Update game world position
      if (isOnCurrentLevel) {
        const prog = DIFFICULTY_PROGRESS[quest.difficulty] || 10
        dispatch({
          type: 'GAME_WORLD_UPDATE',
          payload: { conanPosition: Math.min(100, (gw.conanPosition || 0) + prog) },
        })
      }
    } else {
      dispatch({ type: 'UNCOMPLETE_QUEST', id: quest.id })
    }
  }

  function handleDelete(e) {
    e.stopPropagation()
    dispatch({ type: 'DELETE_QUEST', id: quest.id })
  }

  return (
    <div
      ref={cardRef}
      className={`quest-card ${quest.completed ? 'completed' : ''} ${quest.type}`}
    >
      <div
        className={`quest-checkbox ${quest.completed ? 'checked' : ''}`}
        onClick={handleComplete}
        role="checkbox"
        aria-checked={quest.completed}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleComplete(e)}
      />

      <span className="quest-title">{quest.title}</span>

      <div className="quest-meta">
        <span className={`diff-badge ${quest.difficulty}`}>{quest.difficulty}</span>
        <span className="xp-badge">+{quest.xpReward} XP</span>
        {project && (
          <span className="quest-project-tag">
            {project.icon} {project.name}
          </span>
        )}
      </div>

      {!quest.completed && (
        <button className="quest-delete" onClick={handleDelete} title="Delete quest">
          🗑️
        </button>
      )}
    </div>
  )
}
