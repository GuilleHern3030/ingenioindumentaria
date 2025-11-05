import { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import logo from '../../assets/icons/logo.webp'
import back from '../../assets/icons/leftarrow_black.webp'
import restartSessionIcon from '../../assets/icons/restart.webp'

import styles from './Admin.module.css'

import useUser from '../../hooks/useUser.jsx'

import Revalidate from '../../components/admin/revalidate/Revalidate.jsx'
import Login from '../../components/admin/login/Login.jsx'

export default function() {

    const navigate = useNavigate()

    const { isSignedIn, isAdmin } = useUser()

    const [ isReloading, setIsReloading ] = useState()

    const handleBack = () => {
        const path = location.pathname.split('/')
        path.pop()
        const newPath = path.length > 1 ? path.join('/') : '/'
        navigate(newPath)
    }

    return isSignedIn() === true && isAdmin === false ? <Navigate to="/"/> :
        <div className={styles.panel}>
            <header className={styles.panelHeader}>
                <img className={`${styles.back} cursor`} onClick={handleBack} src={back}/>
                <div className='flex-center cursor'>
                    <img src={logo} onClick={() => navigate("/")}/>
                </div>
                <div className={styles.reload}>
                    { isSignedIn() === true && <img src={restartSessionIcon} className={styles.reload} onClick={() => setIsReloading(true)}/> }
                </div>
            </header>
            <main className={styles.panelContent}>{
                isSignedIn() === false ?
                    <Login/> : isAdmin == true ?
                <>
                    { isReloading && <Revalidate onFinish={() => setIsReloading(false)}/> }
                    <Outlet/>
                </> : <Navigate to="/"/>
            }</main>
                
        </div>
}