import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import UsersPage from './pages/UsersPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import NotFound from './pages/NotFound.jsx'
import { selectAuth, fetchSession } from './store/authSlice.js'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import RoleGuard from './routes/RoleGuard.jsx'
import { startRealtime } from './store/notificationsSlice.js'

export default function App() {
  const dispatch = useDispatch()
  const { status } = useSelector(selectAuth)

  useEffect(() => {
    dispatch(fetchSession())
    dispatch(startRealtime())
  }, [dispatch])

  return (
    <div className="container-app">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />

            <Route element={<RoleGuard roles={['Admin']} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>

            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
