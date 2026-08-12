import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Nav, { Sidebar } from './components/Nav'
import Landing from './screens/Landing'
import Dashboard from './screens/Dashboard'
import Therapy from './screens/Therapy'
import Language from './screens/Language'
import ExerciseList from './screens/ExerciseList'
import Exercise from './screens/Exercise'
import Result from './screens/Result'
import Videos from './screens/Videos'
import Profile from './screens/Profile'
import Progress from './screens/Progress'

function AppShell() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  if (isLanding) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/therapy" element={<Therapy />} />
          <Route path="/language" element={<Language />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/result" element={<Result />} />
          <Route path="/videos" element={<Videos />} />

          <Route path="/progress" element={<Progress />} />
          
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Nav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  )
}
