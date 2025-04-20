import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AuthPage from './pages/RegisterLogin'
import AdminDashboard from './pages/AdminDashboard'
import TeamDashboard from './pages/TeamDashboard'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CategoryEvents from './pages/CategoryEvents'
import TestPage from './TestPage'
import Dance from './components/Dance'
import Music from './components/Music'
import Gaming from './components/Gaming'
import Theatre from './components/Theatre'
import FineArts from './components/FineArts'
import Literary from './components/Literary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/RegisterLogin" element={<AuthPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/team/dashboard" element={<TeamDashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/dance" element={<Dance />} />
        <Route path="/events/music" element={<Music />} />
        <Route path="/events/gaming" element={<Gaming />} />
        <Route path="/events/theatre" element={<Theatre />} />
        <Route path="/events/finearts" element={<FineArts />} />
        <Route path="/events/literary" element={<Literary />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/category/:categoryId" element={<CategoryEvents />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)