import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import logo from '../../assets/icons/logo.webp'
import back from '../../assets/icons/leftarrow_black.webp'

import styles from './Admin.module.css'

import { removeLocalToken, removeLocalUser } from '../../api'

import Login from './login/Login.jsx'

export default function() {

    const navigate = useNavigate()

    const { isLogged } = useContext(AdminContext)
    const [ isLoggedIn, setIsLoggedIn ] = useState(isLogged())

    const handleLogIn = (logIn) => {
        setIsLoggedIn(logIn)
    }

    useEffect(() => {
        /*removeLocalToken()
        removeLocalUser()*/
    }, [])


    return <> { isLoggedIn === false ? 
        <Login logIn={handleLogIn}/>
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
    } </>

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