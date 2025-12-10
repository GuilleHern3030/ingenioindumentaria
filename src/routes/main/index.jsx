export { default as routes } from './routes'

import { Outlet } from 'react-router-dom'

import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import FloatingButton from '@/components/floatingbutton/FloatingButton'

export default function Main() {

    return <>

        <Header/>
        
        <FloatingButton/>

        <Outlet/>

        <Footer/>

    </>

}