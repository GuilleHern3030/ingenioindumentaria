import styles from './Login.module.css'

import { useRef, useState } from 'react'

import useParams from '@/hooks/useParams'
import useUser from '@/hooks/useUser'
import { useCommonI18n } from '@/hooks/useRouteI18N'

import logo from '@/assets/icons/logo.webp'
import key from '@/assets/icons/key.webp'

import Loading from '@/components/loading/Loading'

import { GoogleLogin } from "@react-oauth/google"
import Session from '@/components/icon/session/Session'

export default ({ message, onSuccess=()=>{}, onError=()=>{}, maxTries=3 }) => {

    const { t } = useCommonI18n()

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
        //const credential = response.credential // string
        authenticateRequest({ google: response })
    }

    const authenticateRequest = async(json) => {
        
        try {
            const response = await signIn(json)
            console.log(response)
            setWarning("")
            setIsLoading(false)
            if (response.is_admin)
                onSuccess(response)
            else onError()
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
                        <p>{t('user_name')}</p>
                        <input ref={userName} className={styles.input} id="username" />
                        <p>{t('password')}</p>
                        <input ref={userPassword} className={styles.input} type='password' id="password" />
                        { isLoading === false ? <button id="submit" className={styles.submit}>{t('sign')}</button> : <Loading/> }
                        <p className={styles.o}>{t('or')}</p>
                    </>
                    :
                    <Session 
                        onClick={() => setIsFormShowed(true)}
                        text={t('sign_in_with_password')}
                        src={key}
                        width='100%'
                    />
                }
                <GoogleLogin onSuccess={handleGoogleSession} onError={onError} width='100%'/>
                { warning ? <p className={styles.warning}>{warning}</p> : null }
            </fieldset>
        </form>
    </section>
}