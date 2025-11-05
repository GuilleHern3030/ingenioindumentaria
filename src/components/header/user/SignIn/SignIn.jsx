import { useState, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import useUsers from '../../../../hooks/useUser'
import styles from './SignIn.module.css'
import key from '../../../../assets/icons/key.webp'
import Loading from '../../../loading/Loading'
import { usersCanSignIn } from '../../../../api/config.json'

export default () => {

    const email = useRef()
    const password = useRef()

    const { signIn } = useUsers()

    const [ warning, setWarning ] = useState()
    const [ isAuthenticating, setIsAuthenticating ] = useState(false)
    const [ formShowed, setIsFormShowed ] = useState(false)
    const [ passwordShowed, setPasswordShowed ] = useState(false)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        authenticateRequest({ username: email.current.value, password: password.current.value })
    }
    
    const authenticateRequest = async(json) => {
        setIsAuthenticating(true)
        if (usersCanSignIn == true) try {
            const response = await signIn(json)
            console.log(response)
            setWarning(undefined)
            setIsAuthenticating(false)
        } catch (e) {
            setWarning(e.toString())
        } finally {
            setIsAuthenticating(false)
        }

    }

    return <>
        <hr style={{margin:'1em 0'}}/>
        <p className={styles.title}>Iniciar sesión</p>
        <hr style={{margin:'1em 0'}}/>
        { 
            formShowed === true ? 
            <>
                <p className={styles.subtitle}>Ingresá con un Email</p>
                <p className={styles.label}>Ingresá tu Email</p>
                <input className={styles.input} ref={email} name='email' id="email" />
                <p className={styles.label}>Ingresá tu Contraseña</p>
                <input className={styles.input} ref={password} name='password' type={passwordShowed ? 'text' : 'password'} id="password"/>
                <div className={styles.checkbox}>
                    <input 
                        type='checkbox' 
                        checked={passwordShowed} 
                        onChange={() => setPasswordShowed(!passwordShowed)}
                    />
                    <p>Mostrar contraseña</p>
                </div>

                { isAuthenticating === true ? <Loading/> :
                    <button className={styles.submit} onClick={handleSubmit}>Ingresar</button>
                }
            </>
            :
            <>
                <div className={styles.credentials} onClick={() => setIsFormShowed(true)}>
                    <img className={styles.key} src={key}/>
                    <p className={styles.keytext}>Acceder con Contraseña</p>
                </div>
                { isAuthenticating === true ? <Loading/> : 
                    <div className={styles.google} >
                        <GoogleLogin 
                            onSuccess={response => authenticateRequest({ google: response.credential })} 
                            onError={() => {}}/>
                    </div>
                }
            </>
            
        }
        <p className={styles.warning}>{warning}</p>

    </>

}