import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/normalize.css'
import './assets/styles/scroll-design.css'

// Redux
import store from "./redux/store"; // redux
import { Provider } from "react-redux";

// Context
import { ClientInfoContextProvider } from './context/ClientInfoContext.jsx'
import { DataBaseContextProvider } from './context/DataBaseContext.jsx'
import { ArticlesFilterContextProvider } from './context/ArticlesFilterContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <DataBaseContextProvider>
        <ClientInfoContextProvider>
          <ArticlesFilterContextProvider>
            <App />
          </ArticlesFilterContextProvider>
        </ClientInfoContextProvider>
      </DataBaseContextProvider>
    </Provider>
  </React.StrictMode>,
)
