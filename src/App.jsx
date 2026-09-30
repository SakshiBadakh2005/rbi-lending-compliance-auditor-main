import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage    from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NewAuditPage  from './pages/NewAuditPage.jsx'
import AnalyzingPage from './pages/AnalyzingPage.jsx'
import ResultsPage   from './pages/ResultsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import ReportsPage   from './pages/ReportsPage.jsx'
import SettingsPage  from './pages/SettingsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<LoginPage />} />
      <Route path="/dashboard"       element={<DashboardPage />} />
      <Route path="/analytics"       element={<AnalyticsPage />} />
      <Route path="/reports"         element={<ReportsPage />} />
      <Route path="/settings"        element={<SettingsPage />} />
      <Route path="/audit/new"       element={<NewAuditPage />} />
      <Route path="/audit/analyzing" element={<AnalyzingPage />} />
      <Route path="/audit/results"   element={<ResultsPage />} />
      <Route path="*"                element={<Navigate to="/" replace />} />
    </Routes>
  )
}
