import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Home from "./pages/Home"
import Calendar from "./pages/Calendar"
import TimeDistribution from './pages/TimeDistribution'
import Settings from './pages/Settings'
import Layout from "./layout/Layout"
import ReminderPage from './pages/Reminder'
import ScheduleRule from './pages/ScheduleIntelligence'
import Deadline from './pages/Deadline'

function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<TimeDistribution />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reminderPage" element={<ReminderPage />} />
          <Route path="/reminderPage/:taskId" element={<ReminderPage />} />
          <Route path="/schedulePage" element={<ScheduleRule />} />
          <Route path="/deadline" element={<Deadline />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
