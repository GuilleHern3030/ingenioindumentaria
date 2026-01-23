import { Link, Navigate, useNavigate } from 'react-router-dom'

import styles from './Menu.module.css'

import { useRouteI18n } from "@/hooks/useRouteI18N"
import useUser from '@/hooks/useUser'

import Language from "@/components/language/Language";
import { ThemeSwitch } from "@/components/switch/Switch";

export default ({ onHide, onShowSubmenu }) => {

  const { t, ready } = useRouteI18n("admin")
  const { hasPermission } = useUser()

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
    <div className='menu menu-left' onClick={e => e.stopPropagation()}>

      <hr />

      <ul className='menu__ul'>
        { hasPermission('categories', 'view') && <li><Link to='/admin/categories' onClick={onHide}>{t('categories')}</Link></li> }
        { hasPermission('attributes', 'view') && <li><Link to='/admin/attributes' onClick={onHide}>{t('attributes')}</Link></li> }
        { hasPermission('products', 'view') && <li><Link to='/admin/products' onClick={onHide}>{t('products')}</Link></li> }
      </ul>

      <hr />

      { hasPermission('messages', 'view') && 
        <>
          <ul className='menu__ul'>
            <li><Link to='/admin/messages' onClick={onHide}>{t('messages')}</Link></li>
          </ul>
          <hr />
        </>
      }

      <ul className='menu__ul'>
        { hasPermission('workers', 'view') && <li><Link to='/admin/workers' onClick={onHide}>{t('workers')}</Link></li> }
        { hasPermission('users', 'view') && <li><Link to='/admin/users' onClick={onHide}>{t('users')}</Link></li> }
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