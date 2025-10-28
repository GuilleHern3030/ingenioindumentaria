import { useRef, useState } from 'react'
import styles from './Login.module.css'

import logo from '../../../assets/icons/logo.webp'

import { get as getToken, validateGoogleToken } from '../../../api/authenticate.ts'

import Loading from '../../../components/loading/Loading'

import { GoogleLogin } from "@react-oauth/google";

export default function({onSuccess, onError}) {

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
        
        getToken(user, password)
        .then(token => {
            setWarning("")
            setIsLoading(false)
            onSuccess(token, user)
        })
        .catch(e => {
            setIsLoading(false) 
            setWarning(e.toString())
            if (tries >= 3)
                onError()
        })
    }

    const handleGoogleSession = (token) => {
        setIsLoading(true)

        validateGoogleToken(token)
        .then(result => {
            console.log(result)
            setWarning("")
            setIsLoading(false) 
            const { token, user } = result
            onSuccess(token, user)
        })
        .catch(e => {
            setIsLoading(false) 
            alert(e.toString())
            onError()
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
                <GoogleLogin className={styles.google} onSuccess={handleGoogleSession} onError={onError}/>
            </fieldset>
        </form>
    </main>
}