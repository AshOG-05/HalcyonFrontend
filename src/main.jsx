import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AuthPage from './pages/RegisterLogin'
import AdminDashboard from './pages/AdminDashboard'
import TeamDashboard from './pages/TeamDashboard'
import Profile from './pages/Profile'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CategoryEvents from './pages/CategoryEvents'
import EventRegistrationPage from './components/EventRegistrationPage'
import TestPage from './TestPage'
import TestAdminDashboard from './TestAdminDashboard'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/RegisterLogin" element={<AuthPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/test" element={<TestAdminDashboard />} />
        <Route path="/team/dashboard" element={
          <ErrorBoundary componentName="Team Dashboard">
            <TeamDashboard />
          </ErrorBoundary>
        } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventName" element={<CategoryEvents />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/event/:eventId/register" element={<EventRegistrationPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)