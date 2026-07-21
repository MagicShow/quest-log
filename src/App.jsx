import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { GameProvider, useGame } from './context/GameContext.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import Header from './components/Header.jsx'
import ProjectSidebar from './components/ProjectSidebar.jsx'
import GameWorld from './components/GameWorld.jsx'
import QuestBoard from './components/QuestBoard.jsx'
import RightPanel from './components/RightPanel.jsx'
import PartyPanel from './components/PartyPanel.jsx'
import PartyFeed from './components/PartyFeed.jsx'
import LevelUpModal from './components/LevelUpModal.jsx'

function AppInner() {
  const { user, loading } = useAuth()
  const { state, isLoading } = useGame()

  if (loading || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deep)',
        fontFamily: 'Orbitron, sans-serif',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
      }}>
        LOADING...
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  // User is logged in — show the app
  const hasParty = !!state.party

  return (
    <div className="app">
      <Header />
      <GameWorld />
      <div className="app-body">
        <ProjectSidebar />
        <QuestBoard />
        <div className="right-column">
          {hasParty ? <PartyFeed /> : <PartyPanel />}
          <RightPanel />
        </div>
      </div>
      <LevelUpModal />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </AuthProvider>
  )
}
