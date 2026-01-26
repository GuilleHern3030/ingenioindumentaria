import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'
import '@/assets/styles/menu.css'

import logo from '@/assets/icons/logo.webp'

import { usersCanSignIn, usersCanUseShoppingCart, usersCanSearch } from '@/api/config.json'

import MenuBar from './icon-bars/IconBars'
import MenuUser from './icon-user/IconUser'
import SearchBar from './icon-search/IconSearch'
import ShoppingCart from './icon-cart/IconCart'

import { useCommonI18n } from '@/hooks/useRouteI18N'

export const goTop = () => window.scrollTo({top:0})

export default () => {

    const { t } = useCommonI18n()

    const navigate = useNavigate()

    const [ menuShowed, setMenuShowed ] = useState(null)

    const handleShowMenu = (menu) => {
        setMenuShowed(menu)
    }

    const handleHide = () => {
        setMenuShowed(null)
    }

    return <>
        <header className={styles.header} id='header'>
            <div className={styles.fixedHeader}>

                <div className={`flex-center ${styles.header_aside}`} style={{justifyContent:'flex-start'}}>
                    <MenuBar onHide={handleHide} onShowMenu={handleShowMenu} t={t}/>
                    { usersCanSearch && <SearchBar onHide={handleHide} onShowMenu={handleShowMenu} t={t}/> }
                </div>

                <div onClick={() => navigate("/")} className={`${styles.logo} flex-center cursor`}>
                    <img src={logo}/>
                </div>

                <div className={`flex-center ${styles.header_aside}`} style={{justifyContent:'flex-end'}}>
                    { usersCanSignIn && <MenuUser onHide={handleHide} onShowMenu={handleShowMenu} t={t}/> }
                    { usersCanUseShoppingCart && <ShoppingCart onHide={handleHide} onShowMenu={handleShowMenu} t={t}/> }
                </div>

            </div>

            { menuShowed }
            
        </header>


    </>

}