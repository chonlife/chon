import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation.tsx'
import LanguageSelector from './components/LanguageSelector/LanguageSelector.tsx'
import Home from './pages/Home/Home.tsx'
import Intro from './pages/Intro/Intro.tsx'
import PersonalityTest from './pages/PersonalityTest/PersonalityTest.tsx'
import Contact from './pages/Contact/Contact.tsx'
import Login from './pages/Login/Login.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/personality-test" element={<PersonalityTest />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div style={{ position: 'relative', zIndex: 100 }}>
        <LanguageSelector />
      </div>
    </div>
  )
}

export default App
