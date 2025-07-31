import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import RemoteConfig from './pages/RemoteConfig'

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/remote-config" element={<RemoteConfig />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App