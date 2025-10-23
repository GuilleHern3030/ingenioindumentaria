import { Link, Outlet } from 'react-router-dom'

import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import FloatingButton from '../../components/floatingbutton/FloatingButton'

import { credits, title } from '../../assets/data/data.json'

import styles from './Home.module.css'

import icon from '../../assets/icons/logo.webp'
import logo from '../../assets/images/logo.jpeg'
import Article from '../../components/article/Article'

export default function Home() {

    return <>
        <Header 
            pageName={title}
            logo={icon}
            colorOnScroll='#1f1f1fff'
            changeBackgroundOnScroll={true}>
            <Link to="/about"> Nosotros </Link>
            <Link to="/contact"> Contacto </Link>
        </Header>
        
        <FloatingButton/>

        <Outlet/>

        <Footer color='#000' backgroundColor='#b2afafff' copyrigth='Webpage created by GuilleNH' copyrightHref={credits}/>


    </>

}