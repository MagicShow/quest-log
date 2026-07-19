import { useState, useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'
import ConanCharacter from './ConanCharacter.jsx'

// Level definitions
const LEVELS = [
  {
    id: 1,
    name: 'The Swamp of Sloth',
    background: 'swamp',
    terrain: '#2D4A2D',
    skyTop: '#1A2D1A',
    skyBottom: '#3D5A3D',
    pathColor: '#5A4A3A',
    enemies: [
      { id: 'e1', type: 'slime', label: 'Slime', difficulty: 'easy', position: 15 },
      { id: 'e2', type: 'rat', label: 'Giant Rat', difficulty: 'easy', position: 30 },
      { id: 'e3', type: 'slime', label: 'Slime', difficulty: 'easy', position: 45 },
      { id: 'e4', type: 'rat', label: 'Pack Rat', difficulty: 'easy', position: 60 },
      { id: 'e5', type: 'slime', label: 'Alpha Slime', difficulty: 'easy', position: 75 },
    ],
  },
  {
    id: 2,
    name: 'The Forest of Doubt',
    background: 'forest',
    terrain: '#1A3A2A',
    skyTop: '#0D1F2D',
    skyBottom: '#2D5A4A',
    pathColor: '#5A4A3A',
    enemies: [
      { id: 'e6', type: 'wolf', label: 'Wolf', difficulty: 'medium', position: 20 },
      { id: 'e7', type: 'orcs', label: 'Orc Scout', difficulty: 'medium', position: 40 },
      { id: 'e8', type: 'wolf', label: 'Alpha Wolf', difficulty: 'medium', position: 60 },
      { id: 'e9', type: 'orcs', label: 'Orc Warrior', difficulty: 'medium', position: 80 },
    ],
  },
  {
    id: 3,
    name: 'The Mountain of Resistance',
    background: 'mountain',
    terrain: '#4A4A4A',
    skyTop: '#1A1A2D',
    skyBottom: '#6A6A7A',
    pathColor: '#7A6A5A',
    enemies: [
      { id: 'e10', type: 'ogre', label: 'Ogre', difficulty: 'hard', position: 20 },
      { id: 'e11', type: 'troll', label: 'Cave Troll', difficulty: 'hard', position: 50 },
      { id: 'e12', type: 'ogre', label: 'Ogre Chieftain', difficulty: 'hard', position: 80 },
    ],
  },
  {
    id: 4,
    name: 'The Vendor Lair',
    background: 'cave',
    terrain: '#2A1A1A',
    skyTop: '#1A0A0A',
    skyBottom: '#4A2A2A',
    pathColor: '#3A2A2A',
    lavaGlow: true,
    enemies: [
      { id: 'e13', type: 'demon', label: 'Lesser Demon', difficulty: 'epic', position: 30 },
      { id: 'e14', type: 'demon', label: 'Vendor Demon', difficulty: 'epic', position: 60 },
    ],
  },
  {
    id: 5,
    name: 'The Throne of Focus',
    background: 'castle',
    terrain: '#2A2A3A',
    skyTop: '#0A0A1A',
    skyBottom: '#2A2A4A',
    pathColor: '#5A5A6A',
    castle: true,
    enemies: [
      { id: 'e15', type: 'dragon', label: 'Distraction Dragon', difficulty: 'epic', position: 50 },
    ],
  },
]

const DIFFICULTY_PROGRESS = { easy: 5, medium: 10, hard: 15, epic: 20 }
const LEVEL_BONUS_XP = 200

function getEnemySVG(type) {
  const configs = {
    slime: { color: '#44DD44', body: <ellipse cx="20" cy="24" rx="14" ry="10" fill="#44DD44" /> },
    rat: { color: '#AA8866', body: <rect x="6" y="16" width="28" height="14" rx="6" fill="#AA8866" /> },
    wolf: { color: '#667788', body: <polygon points="20,8 35,28 5,28" fill="#667788" /> },
    orcs: { color: '#557744', body: <polygon points="20,6 34,30 6,30" fill="#557744" /> },
    ogre: { color: '#886644', body: <rect x="4" y="8" width="32" height="26" rx="4" fill="#886644" /> },
    troll: { color: '#445566', body: <rect x="2" y="6" width="36" height="28" rx="4" fill="#445566" /> },
    demon: { color: '#DD3333', body: <polygon points="20,4 38,30 2,30" fill="#DD3333" /> },
    dragon: { color: '#AA22AA', body: <polygon points="20,2 36,26 4,26 20,8" fill="#AA22AA" /> },
  }
  return configs[type] || configs.slime
}

function EnemySprite({ type, defeated, fighting }) {
  const cfg = getEnemySVG(type)
  return (
    <div className={`enemy-sprite ${defeated ? 'defeated' : ''} ${fighting ? 'fighting' : ''}`}>
      <svg viewBox="0 0 40 40" width="48" height="48">
        {cfg.body}
        {/* Eyes */}
        <rect x="13" y="18" width="5" height="5" fill={defeated ? '#666' : '#FF0000'} />
        <rect x="22" y="18" width="5" height="5" fill={defeated ? '#666' : '#FF0000'} />
        {!defeated && <rect x="14" y="19" width="2" height="2" fill="#FFFF00" />}
        {!defeated && <rect x="23" y="19" width="2" height="2" fill="#FFFF00" />}
      </svg>
      {fighting && <div className="enemy-fight-ring" />}
    </div>
  )
}

function LevelBanner({ level, onClose }) {
  return (
    <div className="level-banner-overlay">
      <div className="level-banner">
        <div className="level-banner-title">⚔️ LEVEL {level.id} CLEARED ⚔️</div>
        <div className="level-banner-name">{level.name}</div>
        <ConanCharacter state="victory" direction="right" />
        <div className="level-banner-reward">+{LEVEL_BONUS_XP} XP BONUS</div>
        {level.id < 5 && (
          <div className="level-banner-next">
            Next: {LEVELS[level.id]?.name}
          </div>
        )}
        <button className="level-banner-btn" onClick={onClose}>
          {level.id < 5 ? 'Enter Next Level' : 'Claim Victory'}
        </button>
      </div>
    </div>
  )
}

function GameCompleteScreen({ state, onClose }) {
  const totalQuests = state.quests.filter(q => q.completed).length
  return (
    <div className="level-banner-overlay game-complete">
      <div className="level-banner">
        <div className="game-complete-title">🏆 CONAN THE LEGENDARY 🏆</div>
        <ConanCharacter state="victory" direction="right" />
        <div className="game-complete-sub">You have conquered all five realms!</div>
        <div className="game-complete-stats">
          <div>Level: {state.player.level}</div>
          <div>Total XP: {state.player.xp}</div>
          <div>Quests Completed: {totalQuests}</div>
          <div>Streak: {state.player.streak} days</div>
        </div>
        <button className="level-banner-btn" onClick={onClose}>Return Victorious</button>
      </div>
    </div>
  )
}

export { LEVELS }

export default function GameWorld() {
  const { state, dispatch } = useGame()
  const [adventureMode, setAdventureMode] = useState(false)
  const [animState, setAnimState] = useState('idle')
  const [direction, setDirection] = useState('right')
  const [showBanner, setShowBanner] = useState(null) // null | 'level' | 'complete'
  const [prevLevel, setPrevLevel] = useState(null)
  const worldRef = useRef(null)

  const gw = state.gameWorld || {
    currentLevel: 1,
    conanPosition: 0,
    levelComplete: false,
    gameComplete: false,
    defeatedEnemies: [],
    currentEnemy: null,
  }

  const currentLevel = LEVELS[gw.currentLevel - 1]

  // Get quests for current level's associated project
  // Map level to project: L1=life-admin, L2=home, L3=apps, L4=self, L5=family
  const projectMap = { 1: 'life-admin', 2: 'home', 3: 'apps', 4: 'self', 5: 'family' }
  const projectId = projectMap[gw.currentLevel]
  const levelQuests = state.quests.filter(q => q.project === projectId && !q.completed)
  const completedInProject = state.quests.filter(q => q.project === projectId && q.completed).length
  const totalInProject = state.quests.filter(q => q.project === projectId).length

  // Calculate progress based on completed quests in this project
  const progressPercent = totalInProject > 0
    ? Math.min(100, (completedInProject / totalInProject) * 100)
    : gw.conanPosition

  // Check for level completion
  useEffect(() => {
    if (totalInProject > 0 && completedInProject === totalInProject && !gw.levelComplete && !gw.gameComplete) {
      // Level complete!
      dispatch({
        type: 'GAME_WORLD_UPDATE',
        payload: { levelComplete: true, conanPosition: 100 },
      })
      dispatch({
        type: 'ADD_XP',
        payload: LEVEL_BONUS_XP,
      })
      setAnimState('levelup')
      setTimeout(() => {
        setShowBanner('level')
        setPrevLevel(gw.currentLevel)
      }, 1500)
    }
  }, [completedInProject, totalInProject])

  const handleBannerClose = () => {
    setShowBanner(null)
    if (gw.currentLevel >= 5) {
      dispatch({
        type: 'GAME_WORLD_UPDATE',
        payload: { gameComplete: true },
      })
      setShowBanner('complete')
    } else {
      const nextLevel = gw.currentLevel + 1
      dispatch({
        type: 'GAME_WORLD_UPDATE',
        payload: {
          currentLevel: nextLevel,
          conanPosition: 0,
          levelComplete: false,
          defeatedEnemies: [],
          currentEnemy: null,
        },
      })
      setAnimState('idle')
    }
  }

  const handleCompleteClose = () => {
    setShowBanner(null)
    setAnimState('idle')
  }

  // Trigger walk animation on quest complete
  const handleQuestComplete = (quest) => {
    if (!quest.completed) {
      const prog = DIFFICULTY_PROGRESS[quest.difficulty] || 10
      const newPos = Math.min(100, gw.conanPosition + prog)
      setDirection('right')
      setAnimState('walking')
      dispatch({
        type: 'GAME_WORLD_UPDATE',
        payload: { conanPosition: newPos },
      })
      setTimeout(() => {
        setAnimState(quest.difficulty === 'hard' || quest.difficulty === 'epic' ? 'attacking' : 'idle')
        if (quest.difficulty === 'hard' || quest.difficulty === 'epic') {
          setTimeout(() => setAnimState('idle'), 800)
        }
      }, 600)
    }
  }

  const toggleAdventureMode = () => {
    setAdventureMode(!adventureMode)
    setAnimState('idle')
  }

  if (!adventureMode) {
    // Collapsed view — compact progress bar in header area
    return (
      <div className="game-world-collapsed">
        <button className="adventure-toggle-btn" onClick={toggleAdventureMode}>
          ⚔️ Adventure Mode
        </button>
        <div className="level-progress-compact">
          <span className="level-name-compact">
            L{gw.currentLevel}: {currentLevel?.name}
          </span>
          <div className="progress-bar-compact">
            <div
              className="progress-fill-compact"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="level-num-compact">{gw.currentLevel}/5</span>
        </div>
      </div>
    )
  }

  return (
    <div className="game-world">
      <div className="game-world-header">
        <button className="adventure-toggle-btn active" onClick={toggleAdventureMode}>
          📋 Quest Mode
        </button>
        <div className="game-world-title">
          ⚔️ Adventure Mode — {currentLevel?.name}
        </div>
        <div className="level-indicator">
          Level {gw.currentLevel} / 5
        </div>
      </div>

      {/* Scrolling game world */}
      <div className="game-world-scene" ref={worldRef}>
        <div
          className="game-world-scroll"
          style={{
            background: `linear-gradient(to bottom, ${currentLevel?.skyTop}, ${currentLevel?.skyBottom})`,
            transform: `translateX(${-(progressPercent * 3)}px)`,
          }}
        >
          {/* Terrain layer */}
          <div className="terrain-layer" style={{ background: currentLevel?.terrain }} />

          {/* Path */}
          <div className="path-layer" style={{ background: currentLevel?.pathColor }} />

          {/* Lava glow for cave level */}
          {currentLevel?.lavaGlow && (
            <div className="lava-glow" />
          )}

          {/* Background trees/mountains */}
          {currentLevel?.background === 'swamp' && (
            <div className="bg-swamp">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="swamp-tree" style={{ left: `${i * 9}%`, animationDelay: `${i * 0.3}s` }}>
                  <div className="tree-trunk" />
                  <div className="tree-canopy" />
                </div>
              ))}
            </div>
          )}
          {currentLevel?.background === 'forest' && (
            <div className="bg-forest">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="forest-tree" style={{ left: `${i * 11}%`, height: `${60 + (i % 3) * 20}px` }}>
                  <div className="pine-top" />
                </div>
              ))}
            </div>
          )}
          {currentLevel?.background === 'mountain' && (
            <div className="bg-mountains">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mountain-peak" style={{
                  left: `${i * 20 - 10}%`,
                  height: `${80 + (i % 3) * 40}px`,
                  width: `${100 + (i % 2) * 60}px`,
                }} />
              ))}
            </div>
          )}
          {currentLevel?.background === 'cave' && (
            <div className="bg-cave-stalactites">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="stalactite" style={{
                  left: `${i * 13}%`,
                  height: `${30 + (i % 4) * 20}px`,
                }} />
              ))}
            </div>
          )}
          {currentLevel?.castle && (
            <div className="bg-castle">
              <div className="castle-gate">
                <div className="castle-tower left" />
                <div className="castle-tower right" />
                <div className="castle-wall" />
              </div>
            </div>
          )}

          {/* Enemies */}
          {currentLevel?.enemies.map((enemy) => {
            const isDefeated = gw.defeatedEnemies.includes(enemy.id)
            const isNext = !isDefeated
            const distToNext = Math.abs(progressPercent - enemy.position)
            const isNear = distToNext < 10
            return (
              <div
                key={enemy.id}
                className={`enemy-position ${isNear ? 'enemy-near' : ''}`}
                style={{ left: `${enemy.position}%` }}
              >
                <EnemySprite
                  type={enemy.type}
                  defeated={isDefeated}
                  fighting={false}
                />
                <div className="enemy-label">{enemy.label}</div>
              </div>
            )
          })}

          {/* Level end portal/castle */}
          <div className="level-end" style={{ left: '90%' }}>
            <div className="portal">
              <div className="portal-ring outer" />
              <div className="portal-ring inner" />
              <div className="portal-core" />
            </div>
          </div>

          {/* Conan character */}
          <div
            className="conan-world-position"
            style={{ left: `${Math.min(progressPercent, 85)}%` }}
          >
            <ConanCharacter
              state={animState}
              direction={direction}
              levelProgress={progressPercent}
            />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="world-progress-bar">
        <div className="world-progress-label">
          {currentLevel?.name}
        </div>
        <div className="world-progress-track">
          {currentLevel?.enemies.map(enemy => (
            <div
              key={enemy.id}
              className={`enemy-marker ${gw.defeatedEnemies.includes(enemy.id) ? 'defeated' : ''}`}
              style={{ left: `${enemy.position}%` }}
              title={enemy.label}
            />
          ))}
          <div
            className="world-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="world-conan-marker"
            style={{ left: `${Math.min(progressPercent, 95)}%` }}
          />
        </div>
        <div className="world-progress-stats">
          {levelQuests.length} quests pending in {state.projects.find(p => p.id === projectId)?.name || 'this project'}
        </div>
      </div>

      {/* Level cleared banner */}
      {showBanner === 'level' && prevLevel && (
        <LevelBanner
          level={LEVELS[prevLevel - 1]}
          onClose={handleBannerClose}
        />
      )}
      {showBanner === 'complete' && (
        <GameCompleteScreen state={state} onClose={handleCompleteClose} />
      )}
    </div>
  )
}
