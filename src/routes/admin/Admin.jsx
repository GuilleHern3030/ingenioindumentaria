import { useContext, useEffect, useState } from 'react'
//import { Outlet, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import logo from '../../assets/icons/logo.webp'

import styles from './Admin.module.css'

import { removeLocalToken, removeLocalUser } from '../../api'

import Login from './login/Login.jsx'
import Messages from './messages/Messages.jsx'
import Products from './products/Products.jsx'

export default function() {

    //const navigate = useNavigate()

    const { isLogged } = useContext(AdminContext)
    const [ isLoggedIn, setIsLoggedIn ] = useState(isLogged())
    const [ panel, setPanel ] = useState()

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
            !panel ?
            <div className={styles.list}>
                <button className={styles.button} onClick={() => setPanel(<Products/>)}>Articulos</button>
                <button className={styles.button} onClick={() => setPanel(<Messages/>)}>Mensajes</button>
            </div>
            : 
            <div className={styles.panel}>
                <header className={styles.panelHeader}>
                    <img src={logo} />
                </header>
                <main className={styles.panelContent}>
                    {panel}
                </main>
                <footer className={styles.panelFooter}>
                    <button className={styles.button}  onClick={() => setPanel(undefined)}>Volver al inicio</button>
                </footer>
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