import Routes from './routes'
import { useContext } from 'react'
import { DataBaseContext } from './context/DataBaseContext'

import './App.css'

import Loading from './components/loading/FullLoading'

export default function App() {

  const { isInitializing } = useContext(DataBaseContext)

  return <>{ 
      (isInitializing === true) ? 
        <Loading/> : <Routes/> 
      }
    </>
}
