import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom'

// Redux
//import { useSelector } from 'react-redux'
//import { hasDiscounts } from "@/redux/reducers/articles/articlesSelector";
//import { getSlugs, getCategories } from "@/redux/reducers/categories/categoriesSelector";

import { useCommonI18n } from "@/hooks/useRouteI18N";

import { isAdmin } from '@/api'

import backIconWhite from '@/assets/icons/back.webp'
import backIcon from '@/assets/icons/leftarrow_black.webp'

import styles from './IconBars.module.css'
import StringUtils from "@/utils/StringUtils";
import { ThemeSwitch } from "@/components/switch/Switch";
import useDataBase from "@/hooks/useDataBase";

const goTop = () => window.scrollTo({top:0});

export default ({onShowMenu, onHide, t}) => {

  const [ deployed, setDeployed ] = useState(undefined)

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
            <span className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanTop__active : styles.headerRNSpanTop__inactive}></span>
            <span className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanCenter__active : styles.headerRNSpanCenter__inactive}></span>
            <span className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanBottom__active : styles.headerRNSpanBottom__inactive}></span>
        </div>
        <p>Menu</p>
    </div>
  )
}

const Menu = ({onHide, onShowSubmenu, onBack, hasPromos, slug='', t}) => {
  
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

  return <div className='menu__background' onClick={onHide}>
      <div className='header__background'></div>
      <div className='menu' onClick={e => e.stopPropagation()}>

          <ul className='menu__promotions menu__ul'>
            { slug.length === 0 ?
              <>
                <li className={styles.bold}><Link to='/recent' onClick={onHide}>{t('common:recent')}</Link></li>
                { hasPromos && <li className={styles.bold}><Link to='/promos' onClick={onHide}>{t('common:promos')}</Link></li> }
              </> 
              : 
              <p className={styles.title}>
                <Link to={`/category/${slug}`} onClick={onHide}>
                  {StringUtils.capitalize(slug.split('/')[slug.split('/').length - 1])}
                </Link>
              </p>
            }
          </ul>

          <hr/>

          <ul className='menu__categories menu__ul'>
              <Categories 
                slug={slug} 
                onClick={onShowSubmenu} 
                onLink={handleLink} 
                t={t}
              />
          </ul>

          <hr/>

          <ul className='menu__useful menu__ul'>
            { slug.length === 0 ? 
              <>
                <li className={styles.cursive}><Link to='/about' onClick={handleHide}>{t('common:ubication')}</Link></li>
                <li className={styles.cursive}><Link to='/contact' onClick={handleHide}>{t('common:contact')}</Link></li>
                {/*<li className={styles.cursive}><Link to='/help' onClick={handleHide}>{t('common:help')}</Link></li>*/}
                { isAdmin() === true && <li className={styles.cursive}><Link to="/admin">{t('common:admin')}</Link></li> }
                <hr/>
                <ThemeSwitch className={styles.theme}/>
              </> 
              : 
              <>
                <div className={styles.back} onClick={() => onBack(slug)}>
                  <img className={styles.img} src={backIcon}/>
                  <p>{t('back')}</p>
                </div>
              </>
            }
          </ul>

      </div>
  </div>
}

const Categories = ({slug, onClick, onLink, t}) => {

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