import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'
import './Menu.css'

import logo from '@/assets/icons/logo.webp'
import search from '@/assets/icons/search.webp'
import shoppingcart from '@/assets/icons/shoppingcart.webp'
import user from '@/assets/icons/user.webp'
import cross from '@/assets/icons/cross.webp'

import { usersCanSignIn, usersCanUseShoppingCart, usersCanSearch } from '@/api/config.json'

import MenuBar from './icon-bars/IconBars'
import MenuUser from '@/components/header/icon-user/IconUser'

import useUser from '@/hooks/useUser'
import { useRouteI18n } from '@/hooks/useRouteI18N'

export const goTop = () => window.scrollTo({top:0})

export default ({ isSignedIn, isAdminSessionActive }) => {

    const { t, ready } = useRouteI18n("admin")

    const navigate = useNavigate()
    const { picture } = useUser()

    const [ menuShowed, setMenuShowed ] = useState(null)

    const handleShowMenu = (menu) => {
        setMenuShowed(menu)
    }

    const handleHide = () => {
        setMenuShowed(null)
    }

    return <>
        <header className={styles.header}>
            <div className={styles.fixedHeader}>

                <div className={`flex-center`} style={{justifyContent:'flex-start'}}>
                    { ready && 
                        <MenuBar 
                            isSignedIn={isSignedIn} 
                            isAdminSessionActive={isAdminSessionActive}
                            onHide={handleHide} 
                            onShowMenu={handleShowMenu} 
                            t={t}
                        />
                    }
                </div>

                <div onClick={() => navigate("/")} className={`${styles.logo} flex-center cursor`}>
                    <img src={logo}/>
                </div>

                <div className={`flex-center`} style={{justifyContent:'flex-end'}}>
                    <MenuUser onHide={handleHide} t={t}/>
                    {/*
                    <div className={styles.reload}>
                        { isSignedIn === true && isAdminSessionActive === true && 
                            <img 
                                src={restartSessionIcon} 
                                className={`${styles.reload} cursor`} 
                                onClick={() => setIsRevalidating(true)}
                            /> 
                        }
                    </div>
                    */}
                </div>

            </div>

            { menuShowed }
            
        </header>


    </>

}