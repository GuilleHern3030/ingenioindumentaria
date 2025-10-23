import { createBrowserRouter } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { basename } from '../assets/data/data.json'

import { AdminContextProvider } from '../context/AdminContext'

// Routes
import Home from '../routes/home/Home'
import Contact from '../routes/contact/Contact'
import About from '../routes/about/About'
import Catalog from '../routes/catalog/Catalog'

// Admin routes
import Admin from '../routes/admin/Admin'
import Products from '../routes/admin/products/Products'
import Messages from '../routes/admin/messages/Messages'

export default function useRoutes() {
    return createBrowserRouter([
    {
      path: "*",
      //element: <ErrorRoute/>
      element: <Navigate to="/" replace />
    },
    {
      path: "",
      element: <Home/>,
      children: [
        { path: 'recent', element: <Catalog filter='recent'/> },
        { path: 'promos', element: <Catalog filter='promos'/> },
        { path: 'recent', element: <Catalog filter='recent'/> },
        { path: 'recent', element: <Catalog filter='recent'/> },
      ]
    },
    {
      path: "/about",
      element: <About/>
    },
    {
      path: "/contact",
      element: <Contact/>
    },
    {
      path: "/admin",
      element: <AdminContextProvider><Admin/></AdminContextProvider>,
      children: [
        {
          path: 'products',
          element: <Products/>
        },
        {
          path: 'messages',
          element: <Messages/>
        }
      ]
    }
  ], { basename })
}