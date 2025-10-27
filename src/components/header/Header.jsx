import { useEffect, useState } from 'react'

import styles from './Header.module.css'

import logo from '../../assets/icons/logo.webp'
import search from '../../assets/icons/search.webp'
import shoppingcart from '../../assets/icons/shoppingcart.webp'

import MenuBar from './menu-icon/MenuHamburger'
import Menu from './menu/Menu'
import useArticleFilter from '../../hooks/useArticleFilter'

export const goTop = () => window.scrollTo({top:0})

export default () => {

    const [ isMenuShowed, setIsMenuShowed ] = useState(false)
    const { hideFunction, setHideFunction } = useArticleFilter()

    useEffect(() => {
        setHideFunction(() => () => {
            goTop()
            setIsMenuShowed(false)
    })
    }, [])

    return <>
        <header className={styles.header}>
            <div className={styles.fixedHeader}>
                <div className={`flex-center`} style={{justifyContent:'flex-start'}}>
                    <div className={`${styles.menu} flex-center cursor`}>
                        <MenuBar onClick={e => setIsMenuShowed(e)} deploy={isMenuShowed}/>
                        <p className={styles.hidableText} onClick={() => setIsMenuShowed(!isMenuShowed)}>Menu</p>
                    </div>
                    <div className={`${styles.search} flex-center cursor disabled`}>
                        <img src={search}/>
                        <p className={styles.hidableText}>Buscar</p>
                    </div>
                </div>
                <div className={`${styles.logo} flex-center cursor`}>
                    <img src={logo}/>
                </div>
                <div className={`flex-center disabled`} style={{justifyContent:'flex-end'}}>
                    <div className={`${styles.shoppingcart} cursor`}>
                        <img src={shoppingcart}/>
                    </div>
                </div>
            </div>
            { isMenuShowed === true ? <Menu hide={hideFunction}/> : <></> }
        </header>


    </>

}