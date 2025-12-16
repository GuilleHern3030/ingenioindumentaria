import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom'

// Redux
//import { useSelector } from 'react-redux'
//import { hasDiscounts } from "@/redux/reducers/articles/articlesSelector";
//import { getSlugs, getCategories } from "@/redux/reducers/categories/categoriesSelector";

import { useRouteI18n } from "@/hooks/useRouteI18N";
import useDataBase from "@/hooks/useDataBase";

import { isAdmin } from '@/api'

import backIconWhite from '@/assets/icons/back.webp'
import backIcon from '@/assets/icons/leftarrow_black.webp'

import styles from './IconBars.module.css'
import StringUtils from "@/utils/StringUtils";
import { ThemeSwitch } from "@/components/switch/Switch";
import Language from "@/components/language/Language";

const goTop = () => window.scrollTo({ top: 0 });

export default ({ onShowMenu, onHide, t }) => {

  const [deployed, setDeployed] = useState(undefined)

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

  return (
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

const Menu = ({ onHide, onShowSubmenu, onBack, hasPromos, slug = '' }) => {

  const { t, ready } = useRouteI18n("admin")

  const { categories } = useDataBase()
  const navigate = useNavigate()

  const handleLink = (link) => {
    console.log(link)
    onHide()
    goTop()
    navigate(link)
  }

  const handleHide = () => {
    onHide()
    goTop()
  }

  return ready && <div className='menu__background' onClick={onHide}>
    <div className='header__background'></div>
    <div className='menu' onClick={e => e.stopPropagation()}>

      <hr />

      <ul className='menu__ul'>
        <li><Link to='/admin/categories' onClick={onHide}>{t('categories')}</Link></li>
        <li><Link to='/admin/attributes' onClick={onHide}>{t('attributes')}</Link></li>
        <li><Link to='/admin/products' onClick={onHide}>{t('products')}</Link></li>
      </ul>

      <hr />

      <ul className='menu__ul'>
        <li><Link to='/admin/messages' onClick={onHide}>{t('messages')}</Link></li>
      </ul>

      <hr />

      <ul className='menu__ul'>
        <li><Link to='/admin/workers' onClick={onHide}>{t('workers')}</Link></li>
      </ul>

      <hr />

      <ul className='menu__ul'>
        <li><Link to='/admin' onClick={onHide}>{t('home')}</Link></li>
      </ul>

      <hr />

      <ul className='menu__useful menu__ul'>
        <Language className={styles.theme}/>
        <ThemeSwitch className={styles.theme}/>
      </ul>

    </div>
  </div>
}

const Categories = ({ slug, onClick, onLink, t }) => {

  const { subcategories } = useDataBase()

  const handleOnClick = category => {
    if (subcategories(category).length > 0)
      onClick(category)
    else onLink(`/category/${category}`)
  }

  return subcategories(slug).length > 0 ? subcategories(slug).map((category, key) => <li
    onClick={() => handleOnClick(category)}
    key={key}>
    {
      StringUtils.capitalize(
        StringUtils.lastSlug(category)
      )
    }
  </li>)
    : slug == '' &&
    <li onClick={() => onLink(`/category`)}>{t('common:articles')}</li>

}