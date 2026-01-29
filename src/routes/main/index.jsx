export { default as routes } from './routes'

import { useLayoutEffect, useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './layouts/header/Header'
import Footer from '@/components/footer/Footer'
import FloatingButton from '@/components/floatingbutton/FloatingButton'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useCommonI18n } from '@/hooks/useRouteI18N'

import Banner from '@/components/banner/Banner'

export default function Main() {

    const onLine = useOnlineStatus()
    const [ online, setOnline ] = useState(null)
    const wasItEverOffline = useRef(false)
    const { t } = useCommonI18n()

    useLayoutEffect(() => {
        if (onLine != false && wasItEverOffline.current === false) return;
        wasItEverOffline.current = true
        setOnline(onLine)
    }, [ onLine ])

    return <>

        <Header/>

        <FloatingButton/>

        <Banner text={online ? t('common:online') : t('common:offline')} online={online}/>

        <Outlet/>

        <Footer/>


    </>

}