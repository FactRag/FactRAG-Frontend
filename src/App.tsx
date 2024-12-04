// src/App.tsx
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ResultsPage } from './pages/ResultsPage'
import { AuthProvider } from './contexts/AuthContext'
import { Analytics } from '@vercel/analytics/react';
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </>

  )
}

export default App
