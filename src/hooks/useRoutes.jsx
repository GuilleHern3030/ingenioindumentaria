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
import Article from '../components/article/Article'

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
        { path: 'product/:id', element: <Article/> },
        { path: 'recent', element: <Catalog param='recent'/> },
        { path: 'promos', element: <Catalog param='promos'/> },
        { path: 'category/:gender/:category', element: <Catalog param='category'/> },
        { path: 'products/:category', element: <Catalog param='products'/> },
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