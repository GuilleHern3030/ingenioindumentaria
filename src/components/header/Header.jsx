import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'
import './Menu.css'

import logo from '../../assets/icons/logo.webp'
import search from '../../assets/icons/search.webp'
import shoppingcart from '../../assets/icons/shoppingcart.webp'
import user from '../../assets/icons/user.webp'
import cross from '../../assets/icons/cross.webp'

import { usersCanSignIn, usersCanUseShoppingCart, usersCanSearch } from '../../api/config.json'

import MenuBar from './icon-bars/IconBars'
import MenuUser from './icon-user/IconUser'
import SearchBar from './icon-search/IconSearch'
import ShoppingCart from './icon-cart/IconCart'

import useUser from '../../hooks/useUser'
import User from './user/User'
import { useCommonI18n } from '@/hooks/useRouteI18N'

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

    return <>
        <header className={styles.header}>
            <div className={styles.fixedHeader}>

                <div className={`flex-center`} style={{justifyContent:'flex-start'}}>
                    <MenuBar onHide={handleHide} onShowMenu={handleShowMenu} t={t}/>
                    <SearchBar onHide={handleHide} t={t}/>
                </div>

                <div onClick={() => navigate("/")} className={`${styles.logo} flex-center cursor`}>
                    <img src={logo}/>
                </div>

                <div className={`flex-center`} style={{justifyContent:'flex-end'}}>
                    <ShoppingCart onHide={handleHide} t={t}/>
                    <MenuUser onHide={handleHide} t={t}/>
                </div>

            </div>

            { menuShowed }
            
        </header>


    </>

}