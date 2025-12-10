export { default as routes } from './routes'

import { Outlet } from 'react-router-dom'

import styles from './Attributes.module.css'
import { useRouteI18n } from '@/hooks/useRouteI18N'
import Loading from '@/components/loading/FullLoading'

export default function() {
    const { t, ready } = useRouteI18n("/admin/attributes", "admin")

    return !ready ? <Loading/> : <>
        <p className={styles.title}>{ t('title') }</p>
        <Outlet context={{ t }}/>
    </>

}