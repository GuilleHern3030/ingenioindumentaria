export { default as routes } from './routes'

import { copyright, credits } from '@/assets/data/data.json'

import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'

import Index from './index/AdminIndex'

import { usersCanSignIn } from '@/api/config.json'
import { reload } from '@/api'

import logo from '@/assets/icons/logo.webp'
import back from '@/assets/icons/leftarrow_black.webp'
import restartSessionIcon from '@/assets/icons/sync.webp'
import creditsLogo from '@/assets/images/guillenh.webp'

import styles from './Index.module.css'

import useUser from '@/hooks/useUser.jsx'
import { getParams } from '@/hooks/useParams.jsx'
import { useCommonI18n } from '@/hooks/useRouteI18N'

import Login from '@/routes/admin/components/login/Login.jsx'
import Header from './components/header/Header'

export default function() {

    const { pathname } = useLocation();

    const navigate = useNavigate()    
    
    const { t } = useCommonI18n()

    const [ isRevalidating, setIsRevalidating ] = useState(false)
    
    const { isSignedIn, isAdmin, signOut, isAdminSessionActive, verifyIsAdminSessionActive, setIsAdminSessionActive } = useUser()

    const handleBack = () => {
        if (isAdminSessionActive) {
            const path = location.pathname.split('/')
            path.pop()
            const newPath = path.length > 1 ? path.join('/') : '/'
            navigate(newPath)
        } else navigate('/')
    }

    useEffect(() => {
        if (getParams().signout == 'true') {
            signOut()
            reload()
        }
    }, [])

    useEffect(() => { verifyIsAdminSessionActive() }, [location.pathname])

    // Si el website permite logearse, el usuario está logeado y no es admin, se regresa al index
    if (isSignedIn === true && isAdmin !== true && usersCanSignIn === true && !getParams().force) 
        return <Navigate to={"/"} replace={true} />

    return <>

            <Header isSignedIn={isSignedIn} isAdminSessionActive={isAdminSessionActive}/>

            <main className={styles.panelContent}>
            {

                isSignedIn === true && isAdmin == true ?
                    <>
                        { pathname === "/admin" ? <Index/> : <Outlet/> }

                        { 
                            (isAdminSessionActive !== true || isRevalidating === true) && 
                                <div className={styles.revalidate} onClick={() => setIsRevalidating(false)}>
                                    <Login 
                                        message={t('revalidate_session')}
                                        onSuccess={() => {
                                            setIsAdminSessionActive(true)
                                            setIsRevalidating(false)
                                        }}
                                    />
                                </div>
                        }
                    </> 
                : <Login onSuccess={reload}/>

            }
            </main>

            
            { isSignedIn === true && isAdminSessionActive === true && pathname === "/admin" && 
                <aside className={styles.reload}>
                    <img 
                        src={restartSessionIcon} 
                        className={`${styles.reload} cursor`} 
                        onClick={() => setIsRevalidating(true)}
                    /> 
                </aside>
            }

            <footer className={styles.footer}>
                <a target="_BLANK" href={credits}>
                    <img src={creditsLogo}/>
                    <p>{copyright}</p>
                </a>
            </footer>
                
    </>
}