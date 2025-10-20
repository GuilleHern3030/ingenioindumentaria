import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

import styles from './Admin.module.css'

import { removeLocalToken, removeLocalUser } from '../../api/localtoken.js'

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

    useEffect(() => {
        if (isLoggedIn === true) {
            navigate('/admin/products')
        } else navigate('/admin')
    }, [isLoggedIn])

    return <> { isLoggedIn === false ? 
                <Login logIn={handleLogIn}/>
                : isLoggedIn ?
                <div className={styles.body}>
                    <Outlet/>
                </div>
                : <></>
        } </>
}