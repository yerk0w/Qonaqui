import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { RoomsProvider } from './context/RoomsContext.jsx'
import { BookingsProvider } from './context/BookingsContext.jsx'
import { ServicesProvider } from './context/ServicesContext.jsx'

import './i18n'; // <-- ПРОСТО ДОБАВЬТЕ ЭТУ СТРОКУ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RoomsProvider>
          <ServicesProvider>
            <BookingsProvider>
              <App />
            </BookingsProvider>
          </ServicesProvider>
        </RoomsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
