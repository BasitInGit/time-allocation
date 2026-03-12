import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Home from "./pages/Home"
import Calendar from "./pages/Calendar"
import TimeDistribution from './pages/TimeDistribution'
import Personalise from './pages/Personalise'
import Generate from './pages/Generate'
import Settings from './pages/Setting'

function App() {
  return (
  <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<TimeDistribution />} />
        <Route path="/personalise" element={<Personalise />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/generate" element={<Generate />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
