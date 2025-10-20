import { RouterProvider } from 'react-router-dom'
import { useContext } from 'react'
import { DataBaseContext } from './context/DataBaseContext'
import './App.css'

import useRoutes from './hooks/useRoutes'
import Loading from './components/loading/FullLoading'

export default function App() {

  const { isLoading } = useContext(DataBaseContext)

  const routes = useRoutes()

  return <>{ 
      (isLoading === true) ? 
        <Loading/> 
        : 
        <RouterProvider router={routes}/> 
      }
    </>
}
