import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

const DIFFICULTIES = ['easy', 'medium', 'hard', 'epic']
const TYPES = [
  { value: 'urgent', label: 'Urgent [!]', color: 'var(--accent)' },
  { value: 'important', label: 'Important', color: 'var(--primary)' },
  { value: 'optional', label: 'Optional [~]', color: 'var(--text-muted)' },
]

export default function NewQuestForm({ defaultProject, onClose }) {
  const { state, dispatch } = useGame()
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [type, setType] = useState('important')
  const [project, setProject] = useState(defaultProject || state.projects[0]?.id || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch({
      type: 'ADD_QUEST',
      quest: { title: title.trim(), difficulty, type, project }
    })
    setTitle('')
    onClose()
  }

  return (
    <form className="new-quest-form" onSubmit={handleSubmit}>
      <input
        className="form-input"
        placeholder="What needs to get done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />

      <div className="form-row">
        <div className="diff-selector">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              type="button"
              className={`diff-btn ${difficulty === d ? `selected-${d}` : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <select
          className="form-select"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          {TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={project}
          onChange={e => setProject(e.target.value)}
        >
          {state.projects.map(p => (
            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Add Quest ⚔️</button>
      </div>
    </form>
  )
}
