import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';

import styles from './LogMenu.module.css'
import key from '@/assets/icons/key.webp'
import google from '@/assets/icons/google.webp'

import Cross from '@/components/icon/cross'

import useUser from '@/hooks/useUser'
import Loading from '@/components/loading/Loading';
import Session from '@/components/icon/session/Session';

export default ({ onHide, onShowSubmenu, onBack, onError, onAuth, t }) => {

    const navigate = useNavigate()

    const { signIn } = useUser()

    const [ isLoading, setIsLoading ] = useState(false)
    const [ warning, setWarning ] = useState(false)

    const [ manualLoging, setManualLoging ] = useState(false)
    const userName = useRef()
    const userPassword = useRef()

    const finishSign = (userData) => {
        onSignIn(userData)
    }

    const handleGoogleSession = async (google_response) => {
        if (google_response) try {
            setIsLoading(true)
            setWarning()
            const credential = { google: google_response }
            console.log(credential)
            const response = await signIn(credential)
            onAuth(response)
        } 
        catch(e) { setWarning(e.toString()) } 
        finally { setIsLoading(false) }
    }

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: 'https://ingenioindumentaria.com/auth',
        onSuccess: handleGoogleSession,
        onError: e => setWarning(e.error_description),
    })

    const manualLogin = async(username, password) => {
        setWarning()
        if (username) {
            if (password) {
                try {
                    setIsLoading(true)
                    const response = await signIn({ username, password })
                    console.log(response)
                    onAuth(response)
                }
                catch(e) {
                    console.error(e)
                    if (e.status == 404) { // user not exists (register required)
                        // TODO
                    }
                    setWarning(e.toString()) 
                }
                finally { setIsLoading(false) }
            } else setWarning(t('user:invalid-password'))
        } else setWarning(t('user:invalid-user'))
    }

    return <>
        <div className='menu__background' onClick={onHide}>
            <div className='header__background'></div>
            <div className='menu menu-right' onClick={e => e.stopPropagation()}>

                <div className={styles.title}>
                    <p>{t('user:sign-in')}</p>
                    <Cross className={styles.cross} onClick={onHide} />
                </div>

                <hr />

                { warning && <p className='warning'>{warning}</p> }

                { !isLoading || manualLoging ?
                    <>
                        <div className={styles.sign_options}>

                            { !manualLoging ?
                                <div className={styles.sign_option}>
                                    <Session 
                                        width={"100%"}
                                        src={key} 
                                        onClick={() => setManualLoging(true)}
                                        text={t("user:sign-in-with-password")}
                                    />
                                </div>
                                :
                                <div className={styles.sign_option_selected}>
                                    <p>{t('email')}</p>
                                    <input ref={userName} className={styles.input} id="username" />
                                    <p>{t('password')}</p>
                                    <input ref={userPassword} className={styles.input} type='password' id="password" />
                                    { isLoading === false ? <p id="submit" className={styles.submit} onClick={() => manualLogin(userName.current.value, userPassword.current.value)}>{t('sign')}</p> : <Loading/> }
                                    <hr/>
                                </div>
                            }

                            <div className={styles.sign_option}>
                                <GoogleLogin width={"100%"} onSuccess={handleGoogleSession} onError={onError}/>
                            </div>

                        </div>
                    </> : <Loading/>
                }

                <hr />

                <p 
                    className={`button_square_white ${styles.back}`} 
                    onClick={() => onHide()}>
                    {t('common:back')}
                </p>

            </div>

        </div>
    </>
}