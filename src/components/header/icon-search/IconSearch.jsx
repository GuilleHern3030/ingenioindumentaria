import { useContext, useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import styles from './IconSearch.module.css'

import search_light from './search-black.webp'
import search_dark from './search-white.webp'

import { ThemeContext } from '@/context/ThemeContext'

import Cross from "@/components/icon/cross";

export default ({ onShowMenu, onHide, t }) => {

    const [ deployed, setDeployed ] = useState(undefined)

    const { theme } = useContext(ThemeContext)

    const navigate = useNavigate()

    const handleHide = () => {
        setDeployed(false)
        return onHide()
    }

    const handleBack = () => {
        return handleShowMenu()
    }

    const handleSearch = (prompt) => {
        if (prompt?.length > 0)
            navigate(`/search/${prompt}`)
    }

    const handleNavAnimation = () => {
        const newDeployment = (deployed === undefined) ? true : !deployed
        setDeployed(newDeployment)
        if (!deployed)
            handleShowMenu()
        else handleHide()
    }

    const handleShowMenu = () => {
        onShowMenu(<SearchBar
            onHide={handleHide}
            onBack={handleBack}
            onSearch={handleSearch}
            t={t}
        />
        )
    }

    return (
        <div className={styles.search} onClick={handleNavAnimation}>
            <div className={styles.img}>
                <img src={theme == 'dark' ? search_dark : search_light} />
            </div>
            <div className={styles.navMenu}>
                <p className={styles.title}>{t('common:search')}</p>
            </div>
        </div>
    )
}

const SearchBar = ({ onHide, onBack, onSearch, t }) => {

    const inputRef = useRef()

    return <>
        <div className={styles.search_background_header} onClick={onHide}/>
        <div className={styles.search_background} onClick={onHide}/>
        <div className={styles.search_box}>
            <div>
                <div className={styles.input}>
                    <input 
                        ref={inputRef} 
                        placeholder={t('common:search')}
                        onKeyDown={e => e.key == "Enter" && onSearch(inputRef.current.value)}
                    />
                    <p>{'|'}</p>
                    <img 
                        src={search_light} 
                        onClick={() => onSearch(inputRef.current.value)}
                    />
                </div>
                <Cross className={styles.cross} onClick={onHide}/>
            </div>
        </div>
    </>
}

const Menu = ({ onHide, onBack, t }) => {

    const navigate = useNavigate()

    const handleLink = (link) => {
        console.log(link)
        onHide()
        goTop()
        navigate(link)
    }

    const handleHide = () => {
        onHide()
    }

    const handleSelect = (article) => {

    }

    return <div className='menu__background' onClick={onHide}>
        <div className='header__background'></div>
        <div className='menu menu-left' onClick={e => e.stopPropagation()}>

            <div className={styles.title}>
            </div>

            <hr />

        </div>
    </div>
}