import { Link } from 'react-router-dom'

import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import FloatingButton from '../../components/floatingbutton/FloatingButton'

import { credits } from '../../data/references.json'
import { title } from '../../data/client-info.json'

import styles from './Home.module.css'

import logo from '../../assets/images/logo.jpeg'

export default function Home() {

    return <>
        <Header 
            image={undefined}
            pageName={title}
            colorOnScroll='#1f1f1fff'
            changeBackgroundOnScroll={true}>
            <Link to="/about"> Nosotros </Link>
            <Link to="/contact"> Contacto </Link>
        </Header>
        
        <FloatingButton/>

        <div className={styles.logo}>
            <img src={logo}/>
        </div>
        
        <p className={styles.logo} style={{fontSize:"28px"}}>Proximamente...</p>

        <div style={{paddingTop:'16vw'}} />

        <Footer color='#000' backgroundColor='#b2afafff' copyrigth='Webpage created by GuilleNH' copyrightHref={credits}/>


    </>

}