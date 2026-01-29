import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './assets/styles/normalize.css'
import './assets/styles/scroll-design.css'
import './assets/styles/themes.css'

// i18next
import "./utils/i18n.js";
import "./utils/console.js";

// Redux
import store from "./redux/store"; // redux
import { Provider } from "react-redux";

// Context
import { ClientInfoContextProvider } from './context/ClientInfoContext.jsx'
import { DataBaseContextProvider } from './context/DataBaseContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { ThemeContextProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <DataBaseContextProvider>
        <ThemeContextProvider>
          <ClientInfoContextProvider>
            <UserContextProvider>
              <App />
            </UserContextProvider>
          </ClientInfoContextProvider>
        </ThemeContextProvider>
      </DataBaseContextProvider>
    </Provider>
  </React.StrictMode>,
)
