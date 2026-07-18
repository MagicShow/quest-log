import { useGame } from '../context/GameContext.jsx'

export default function EnergyBar({ current, max }) {
  const pct = Math.round((current / max) * 100)
  let cls = ''
  if (pct < 15) cls = 'low'
  else if (pct < 30) cls = 'medium'

  return (
    <div className="energy-bar-outer" title={`Energy: ${current}/${max}`}>
      <div className="energy-bar-inner" style={{ width: `${pct}%` }} />
    </div>
  )
}
