import { GameProvider } from './context/GameContext.jsx'
import Header from './components/Header.jsx'
import ProjectSidebar from './components/ProjectSidebar.jsx'
import QuestBoard from './components/QuestBoard.jsx'
import RightPanel from './components/RightPanel.jsx'
import LevelUpModal from './components/LevelUpModal.jsx'

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <ProjectSidebar />
          <QuestBoard />
          <RightPanel />
        </div>
        <LevelUpModal />
      </div>
    </GameProvider>
  )
}
