import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/normalize.css'
import './assets/styles/scroll-design.css'
import { ClientInfoContextProvider } from './context/ClientInfoContext.jsx'
import { DataBaseContextProvider } from './context/DataBaseContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataBaseContextProvider>
      <ClientInfoContextProvider>
        <App />
      </ClientInfoContextProvider>
    </DataBaseContextProvider>
  </React.StrictMode>,
)
