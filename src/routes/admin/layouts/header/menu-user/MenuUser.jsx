import { useContext, useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import styles from './IconUser.module.css'
import menuStyles from './MenuUser.module.css'

import { ThemeContext } from '@/context/ThemeContext'

import user_light from '@/assets/icons/user-black.webp'
import user_dark from '@/assets/icons/user-white.webp'

import Cross from "@/components/icon/cross";
import Dialog from "@/components/dialog/Dialog";

import useClientInfo from "@/hooks/useClientInfo";
import useUser from "@/hooks/useUser";

import UserMenu from "./user-menu/UserMenu";
import LogMenu from "@/components/header/icon-user/log-menu/LogMenu";

export default ({ onShowMenu, onHide, t }) => {

    const [ deployed, setDeployed ] = useState(undefined)

    const { theme } = useContext(ThemeContext)

    const { isSignedIn, picture } = useUser()

    const handleHide = () => {
        setDeployed(false)
        return onHide()
    }

    const handleBack = () => {
        return handleShowMenu('')
    }

    const handleNavAnimation = () => {
        const newDeployment = (deployed === undefined) ? true : !deployed
        setDeployed(newDeployment)
        if (!deployed)
            handleShowMenu()
        else handleHide()
    }

    const handleAuthenticate = (data) => {
        handleShowMenu(data ? UserMenu : LogMenu)
    }

    const handleShowMenu = (Menu = isSignedIn ? UserMenu : LogMenu) => {
        onShowMenu(
            <Menu
                onHide={handleHide}
                onShowSubmenu={handleShowMenu}
                onBack={handleBack}
                onAuth={handleAuthenticate}
                t={t}
            />
        )
    }

    return (
        <div className={styles.user} onClick={handleNavAnimation}>
            <div className={styles.img}>
                <img src={ picture ? picture : theme == 'dark' ? user_dark : user_light} />
            </div>
        </div>
    )

}