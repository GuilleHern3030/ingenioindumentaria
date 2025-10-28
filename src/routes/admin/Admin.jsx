import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import logo from '../../assets/icons/logo.webp'
import back from '../../assets/icons/leftarrow_black.webp'

import styles from './Admin.module.css'

import { GoogleOAuthProvider } from "@react-oauth/google";

import { removeLocalToken, removeLocalUser, setLocalToken, setLocalUser } from '../../api'

import Login from './login/Login.jsx'

const CLIENT_ID  = "164682043545-n2p5pgj7u4rf53iiajr8tu37t8jqkh0j.apps.googleusercontent.com"

export default function() {

    const navigate = useNavigate()

    const { isLogged } = useContext(AdminContext)
    const [ isLoggedIn, setIsLoggedIn ] = useState(isLogged())

    const handleLoginSuccess = (token, user) => {
        setIsLoggedIn(true)
        setLocalToken(token)
        setLocalUser(user)
    }

    const handleLoginError = () => {
        window.open(window.location.origin, "_self")
    }

    useEffect(() => {
        /*removeLocalToken()
        removeLocalUser()*/
    }, [])


    return <GoogleOAuthProvider clientId={CLIENT_ID}> { isLoggedIn === false ? 
        <Login onSuccess={handleLoginSuccess} onError={handleLoginError}/>
        //<GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
        : isLoggedIn && (
            <div className={styles.panel}>
                <header className={styles.panelHeader}>
                    <img className={`${styles.back} cursor`} onClick={() => navigate("/admin")} src={back}/>
                    <div className='flex-center cursor'>
                        <img src={logo} onClick={() => navigate("/")}/>
                    </div>
                </header>
                <main className={styles.panelContent}>
                    <Outlet/>
                </main>
            </div>
        )
    } </GoogleOAuthProvider>

    /*
    return <> { isLoggedIn === false ? 
                <Login logIn={handleLogIn}/>
                : isLoggedIn ?
                <div className='admin-body'>
                    <Outlet/>
                </div>
                : <></>
        } </>
         */
}