import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import logo from '../../assets/icons/logo.webp'
import back from '../../assets/icons/leftarrow_black.webp'
import exit from '../../assets/icons/session-out.webp'

import styles from './Admin.module.css'

import { setLocalToken, setAdminUser, setWasAdminSignedIn, setAdminSignedIn, removeAdminUser, reload, removeLocalToken } from '../../api'
import Login from './login/Login.jsx'

import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID  = "164682043545-n2p5pgj7u4rf53iiajr8tu37t8jqkh0j.apps.googleusercontent.com"

export default function() {

    const navigate = useNavigate()

    const { isLogged } = useContext(AdminContext)
    const [ isLoggedIn, setIsLoggedIn ] = useState(isLogged())

    const handleLoginSuccess = (token, user) => {
        setIsLoggedIn(true)
        setAdminSignedIn(true)
        setWasAdminSignedIn()
        setLocalToken(token)
        setAdminUser(user)
    }

    const handleLoginError = () => {
        window.open(window.location.origin, "_self")
    }

    const handleBack = () => {
        const path = location.pathname.split('/')
        path.pop()
        const newPath = path.length > 1 ? path.join('/') : '/'
        navigate(newPath)
    }

    const handleCloseSession = () => {
        setAdminSignedIn(false)
        removeLocalToken()
        removeAdminUser()
        reload()
    }

    useEffect(() => {
        /*removeLocalToken()
        removeAdminUser()*/
    }, [])

    return <GoogleOAuthProvider clientId={CLIENT_ID}> { isLoggedIn === false ? 
        <Login onSuccess={handleLoginSuccess} onError={handleLoginError}/>
        //<GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
        : isLoggedIn && (
            <div className={styles.panel}>
                <header className={styles.panelHeader}>
                    <img className={`${styles.back} cursor`} onClick={handleBack} src={back}/>
                    <div className='flex-center cursor'>
                        <img src={logo} onClick={() => navigate("/")}/>
                    </div>
                    <div className={styles.exit}>
                        <img src={exit} className={styles.exit} onClick={handleCloseSession}/>
                    </div>
                </header>
                <main className={styles.panelContent}>
                    <Outlet/>
                </main>
            </div>
        )
    } </GoogleOAuthProvider>
}