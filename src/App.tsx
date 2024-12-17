// src/App.tsx
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ResultsPage } from './pages/ResultsPage'
import { AuthProvider } from './contexts/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthCallback } from './components/AuthCallback'

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/auth/callback/?tokens=:tokens&dataset=:dataset&term_id=:term_id" element={<AuthCallback />}  />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
