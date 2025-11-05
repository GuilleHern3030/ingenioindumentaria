import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'

import logo from '../../assets/icons/logo.webp'
import search from '../../assets/icons/search.webp'
import shoppingcart from '../../assets/icons/shoppingcart.webp'
import user from '../../assets/icons/user.webp'
import cross from '../../assets/icons/cross.webp'

import { usersCanSignIn, usersCanUseShoppingCart, usersCanSearch } from '../../api/config.json'

import MenuBar from './menu-icon/MenuHamburger'
import Menu from './menu/Menu'

import useArticleFilter from '../../hooks/useArticleFilter'
import useUser from '../../hooks/useUser'
import User from './user/User'

export const goTop = () => window.scrollTo({top:0})

export default () => {

    const navigate = useNavigate()
    const { picture } = useUser()

    const [ isMenuShowed, setIsMenuShowed ] = useState(false)
    const [ isUserMenuShowed, setIsUserMenuShowed ] = useState(false)
    const { hideFunction, setHideFunction } = useArticleFilter()

    useEffect(() => {
        setHideFunction(() => () => {
            goTop()
            setIsMenuShowed(false)
            setIsUserMenuShowed(false)
        })
    }, [])

    const handleShowMenu = (menuShowed) => {
        if (isUserMenuShowed === false)
            setIsMenuShowed(menuShowed)
    }

    const handleShowUserMenu = (menuShowed) => {
        if (isMenuShowed === false)
            setIsUserMenuShowed(menuShowed)
    }

    return <>
        <header className={styles.header}>
            <div className={styles.fixedHeader}>
                <div className={`flex-center`} style={{justifyContent:'flex-start'}}>
                    <div className={`${styles.menu} flex-center cursor`}>
                        <MenuBar onClick={e => handleShowMenu(e)} deploy={isMenuShowed}/>
                        <p className={styles.hidableText} onClick={() => handleShowMenu(!isMenuShowed)}>Menu</p>
                    </div>
                    <div className={`${styles.search} flex-center cursor ${usersCanSearch == false && 'disabled'}`}>
                        <img src={search}/>
                        <p className={styles.hidableText}>Buscar</p>
                    </div>
                </div>
                <div onClick={() => navigate("/")} className={`${styles.logo} flex-center cursor`}>
                    <img src={logo}/>
                </div>
                <div className={`flex-center`} style={{justifyContent:'flex-end'}}>
                    <div className={`${styles.shoppingcart} cursor ${usersCanUseShoppingCart == false && 'disabled'}`}>
                        <img src={shoppingcart}/>
                    </div>
                    <div className={`${styles.user} cursor ${usersCanSignIn == false && 'disabled'}`} onClick={e => handleShowUserMenu(!isUserMenuShowed)}>
                        <img src={isUserMenuShowed === true ? cross : picture ? picture : user}/>
                    </div>
                </div>
            </div>

            { isMenuShowed === true ? <Menu hide={hideFunction}/> : <></> }
            { isUserMenuShowed === true ? <User hide={hideFunction}/> : <></> }
            
        </header>


    </>

}