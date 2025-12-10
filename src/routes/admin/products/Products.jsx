export { default as routes } from './routes'

import { Outlet } from 'react-router-dom'

import styles from './Products.module.css'
import { useRouteI18n } from '@/hooks/useRouteI18N'
import Loading from '@/components/loading/FullLoading'

export default function() {
    const { t, ready } = useRouteI18n("/admin/products", "admin")

    return !ready ? <Loading/> : <>
        <p className={styles.title}>{ t('title') }</p>
        <Outlet context={{ t }}/>
    </>

}