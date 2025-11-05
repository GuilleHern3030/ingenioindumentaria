import styles from './Login.module.css'

import { useRef, useState } from 'react'

import useParams from '../../../hooks/useParams'
import useUser from '../../../hooks/useUser'

import logo from '../../../assets/icons/logo.webp'
import key from '../../../assets/icons/key.webp'

import Loading from '../../../components/loading/Loading'

import { GoogleLogin } from "@react-oauth/google"

export default ({ onSuccess, onError, maxTries=3, message }) => {

    const [ isFormShowed, setIsFormShowed ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ tries, setTries ] = useState(0)
    const [ warning, setWarning ] = useState("")

    const userName = useRef()
    const userPassword = useRef()

    const params = useParams()
    const { signIn } = useUser()

    const handleSubmit = e => {
        e.preventDefault()
        setIsLoading(true)

        const username = userName.current.value
        const password = userPassword.current.value

        authenticateRequest({ username, password })
    }

    const handleGoogleSession = (response) => {
        setTries(maxTries + 1)
        setIsLoading(true)
        const credential = response.credential
        authenticateRequest({ google: credential })
    }

    const authenticateRequest = async(json) => {
        
        try {
            const response = await signIn(json)
            setWarning("")
            setIsLoading(false)
            onSuccess(response)
        } catch (e) {
            console.error(e)
            setWarning(e.toString())
            if (tries >= maxTries) 
                onError(e)
        } finally {
            setTries(tries => tries+1)
            setIsLoading(false)
        }

    }

    return <section className={styles.login_section}>
        <form id="form" className={styles.form} onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
            <div className={styles.logo}>
                <img className={styles.logo} src={logo}/>
            </div>
            { message && <p className={styles.message}>{message}</p> }
            {/* params.message && <p className={styles.ad}>{params.message}</p> */}
            <fieldset className={styles.fieldset}>
                { isFormShowed === true ? 
                    <>
                        <p>Nombre de usuario</p>
                        <input ref={userName} className={styles.input} id="username" />
                        <p>Contraseña</p>
                        <input ref={userPassword} className={styles.input} type='password' id="password" />
                        { isLoading === false ? <button id="submit" className={styles.submit}>Ingresar</button> : <Loading/> }
                        <p className={styles.o}>o</p>
                    </>
                    :
                    <div className={styles.credentials} onClick={() => setIsFormShowed(true)}>
                        <img className={styles.key} src={key}/>
                        <p className={styles.keytext}>Acceder con Contraseña</p>
                    </div>
                }
                <GoogleLogin className={styles.google} onSuccess={handleGoogleSession} onError={onError}/>
                { warning ? <p className={styles.warning}>{warning}</p> : null }
            </fieldset>
        </form>
    </section>
}