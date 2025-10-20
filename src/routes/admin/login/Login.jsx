import { useContext, useRef, useState } from 'react'
import styles from './Login.module.css'

import logo from '../../../assets/icons/logo.webp'

import { get as getToken } from '../../../api/authenticate.ts'
import { AdminContext } from '../../../context/AdminContext'

import Loading from '../../../components/loading/Loading'

export default function({logIn}) {

    const [ isLoading, setIsLoading ] = useState(false)
    const [ tries, setTries ] = useState(0)
    const [ warning, setWarning ] = useState("")

    const userName = useRef()
    const userPassword = useRef()

    const handleSubmit = e => {
        e.preventDefault()
        setTries(tries => tries+1)
        setIsLoading(true)

        const user = userName.current.value
        const password = userPassword.current.value

        if (!user) {
            setWarning("Usuario es un campo obligatorio")
            setIsLoading(false) 
            return;
        }

        if (!password) {
            setWarning("Password es un campo obligatorio")
            setIsLoading(false) 
            return;
        }
        
        getToken(user, password)
            .then(token => {
                setWarning("")
                setIsLoading(false)
                logIn(true)
            })
            .catch(e => {
                setIsLoading(false) 
                setWarning(e.toString())
                if (tries >= 3)
                    window.open(window.location.origin, "_self")
            })
    }

    return <main className={styles.main}>
        <form id="form" className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.logo}>
                <img className={styles.logo} src={logo}/>
            </div>
            <fieldset className={styles.fieldset}>
                <p>Nombre de usuario</p>
                <input ref={userName} className={styles.input} id="username" />
                <p>Contraseña</p>
                <input ref={userPassword} className={styles.input} type='password' id="password" />
                { isLoading === false ? <button id="submit" className={styles.submit}>Ingresar</button> : <Loading/> }
                { warning ? <p className={styles.warning}>{warning}</p> : null }
            </fieldset>
        </form>
    </main>
}