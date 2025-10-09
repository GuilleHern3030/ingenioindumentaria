import { createBrowserRouter } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import options from '../data/references.json'

// Routes
import Home from '../routes/home/Home'
import Contact from '../routes/contact/Contact'
import About from '../routes/about/About'

export default function useRoutes() {
    return createBrowserRouter([
      {
      path: "*",
      //element: <ErrorRoute/>
      element: <Navigate to="/" replace />
    },
    {
      path: "",
      element: <Home/>
    },
    {
      path: "/about",
      element: <About/>
    },
    {
      path: "/contact",
      element: <Contact/>
    }
  ], options)
}