import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

export default function ProjectSidebar({ activeProject, onSelectProject }) {
  const { state, dispatch } = useGame()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('🎯')
  const [newColor, setNewColor] = useState('#00E5FF')

  const icons = ['⚔️', '🏠', '🚀', '👨‍👧‍👦', '💪', '💼', '📚', '🎯', '🔥', '⭐', '🛡️', '⚡']
  const colors = ['#00E5FF', '#FF2D78', '#00FF88', '#FFD700', '#FF9500', '#A855F7']

  function handleAddProject() {
    if (!newName.trim()) return
    const id = newName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    dispatch({
      type: 'ADD_PROJECT',
      project: { id, name: newName.trim(), icon: newIcon, color: newColor }
    })
    setNewName('')
    setShowAdd(false)
  }

  const pendingQuests = state.quests.filter(q => !q.completed)
  const doneQuests = state.quests.filter(q => q.completed)

  return (
    <aside className="project-sidebar">
      <div className="sidebar-title">Campaigns</div>

      <div
        className={`project-item ${!activeProject ? 'active' : ''}`}
        style={{ '--project-color': 'var(--primary)' }}
        onClick={() => onSelectProject(null)}
      >
        <span className="project-icon">📋</span>
        <span className="project-name">All Quests</span>
        <span className="quest-count">{pendingQuests.length}</span>
      </div>

      {state.projects.map(project => {
        const count = pendingQuests.filter(q => q.project === project.id).length
        return (
          <div
            key={project.id}
            className={`project-item ${activeProject === project.id ? 'active' : ''}`}
            style={{ '--project-color': project.color }}
            onClick={() => onSelectProject(activeProject === project.id ? null : project.id)}
          >
            <span className="project-icon">{project.icon}</span>
            <span className="project-name">{project.name}</span>
            {count > 0 && <span className="quest-count">{count}</span>}
          </div>
        )
      })}

      {!showAdd ? (
        <button className="add-project-btn" onClick={() => setShowAdd(true)}>
          <span>+</span> New Campaign
        </button>
      ) : (
        <div className="new-quest-form" style={{ gap: 8 }}>
          <input
            className="form-input"
            placeholder="Campaign name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {icons.map(icon => (
              <button
                key={icon}
                onClick={() => setNewIcon(icon)}
                style={{
                  background: newIcon === icon ? 'var(--bg-hover)' : 'var(--bg-elevated)',
                  border: newIcon === icon ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setNewColor(color)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: color,
                  border: newColor === color ? '3px solid white' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddProject}>Add</button>
          </div>
        </div>
      )}
    </aside>
  )
}
