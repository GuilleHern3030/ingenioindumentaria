export { default as routes } from './routes'

import { Outlet } from 'react-router-dom'

import { useRouteI18n } from '@/hooks/useRouteI18N'
import Loading from '@/components/loading/FullLoading'

export default function() {
    const { t, ready } = useRouteI18n("/admin/categories", "admin")

    return !ready ? <Loading/> : <>
        <Outlet context={{ t }}/>
    </>

}