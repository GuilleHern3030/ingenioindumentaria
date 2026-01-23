import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'
import '@/assets/styles/menu.css'

import logo from '@/assets/icons/logo.webp'
import cross from '@/assets/icons/cross.webp'

import { usersCanSignIn, usersCanUseShoppingCart, usersCanSearch } from '@/api/config.json'

import MenuBar from './menu-main/MenuMain'
import MenuUser from './menu-user/MenuUser'

import { useCommonI18n } from '@/hooks/useRouteI18N'
import useUser from '@/hooks/useUser'

export const goTop = () => window.scrollTo({top:0})

export default () => {

    const { t } = useCommonI18n()

    const navigate = useNavigate()
    const { picture } = useUser()

    const [ menuShowed, setMenuShowed ] = useState(null)

    const handleShowMenu = (menu) => {
        setMenuShowed(menu)
    }

    const handleHide = () => {
        setMenuShowed(null)
    }

    const handleLogoClicked = () => {
        console.clear()
        navigate("/")
    }

    return <>
        <header className={styles.header}>
            <div className={styles.fixedHeader}>

                <div className={`flex-center`} style={{justifyContent:'flex-start'}}>
                    { 
                        <MenuBar 
                            onHide={handleHide} 
                            onShowMenu={handleShowMenu} 
                        />
                    }
                </div>

                <div onClick={handleLogoClicked} className={`${styles.logo} flex-center cursor`}>
                    <img src={logo}/>
                </div>

                <div className={`flex-center`} style={{justifyContent:'flex-end'}}>
                    <MenuUser onHide={handleHide} onShowMenu={handleShowMenu} t={t}/>
                </div>

            </div>

            { menuShowed }
            
        </header>


    </>

}