import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useRouteI18n } from "@/hooks/useRouteI18N";
import useDataBase from "@/hooks/useDataBase";
import useUser from '@/hooks/useUser'

import { isAdmin } from '@/api'

import backIconWhite from '@/assets/icons/back.webp'
import backIcon from '@/assets/icons/leftarrow_black.webp'

import styles from './Menu.module.css'

import { ThemeSwitch } from "@/components/switch/Switch";
import Language from "@/components/language/Language";

import Menu from "./menu/Menu";

const goTop = () => window.scrollTo({ top: 0 });

export default ({ onShowMenu, onHide }) => {
  
  const [ deployed, setDeployed ] = useState(undefined)

  const { t, ready } = useRouteI18n("admin")

  const { hasPromos } = useDataBase()

  const handleHide = () => {
    setDeployed(false)
    return onHide()
  }

  const handleBack = (slug) => {
    const newSlug = slug.split('/')
    newSlug.pop()
    return handleShowMenu(newSlug.join('/'))
  }

  const handleShowMenu = (slug) => {
    onShowMenu(<Menu
      onHide={handleHide}
      onShowSubmenu={handleShowMenu}
      onBack={handleBack}
      slug={slug}
      hasPromos={hasPromos}
      t={t}
    />
    )
  }

  const handleNavAnimation = () => {
    const newDeployment = (deployed === undefined) ? true : !deployed
    setDeployed(newDeployment)
    if (!deployed)
      handleShowMenu('')
    else handleHide()
  }

  return ready && (
    <div className={styles.navDeployed} onClick={handleNavAnimation}>
      <div className={styles.navMenu}>
        <span className={deployed === undefined ? "" : deployed ? styles.headerRNSpanTop__active : styles.headerRNSpanTop__inactive}></span>
        <span className={deployed === undefined ? "" : deployed ? styles.headerRNSpanCenter__active : styles.headerRNSpanCenter__inactive}></span>
        <span className={deployed === undefined ? "" : deployed ? styles.headerRNSpanBottom__active : styles.headerRNSpanBottom__inactive}></span>
      </div>
      <p>{t('menu')}</p>
    </div>
  )
}
