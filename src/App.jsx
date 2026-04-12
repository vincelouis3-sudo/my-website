import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ClientSnapshot from './pages/ClientSnapshot.jsx'
import AdvisorSnapshot from './pages/AdvisorSnapshot.jsx'
import BackOfficeSnapshot from './pages/BackOfficeSnapshot.jsx'
import ExecutiveSnapshot from './pages/ExecutiveSnapshot.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client" element={<ClientSnapshot />} />
          <Route path="/advisor" element={<AdvisorSnapshot />} />
          <Route path="/back-office" element={<BackOfficeSnapshot />} />
          <Route path="/executive" element={<ExecutiveSnapshot />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
