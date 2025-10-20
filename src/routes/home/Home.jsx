import { Link } from 'react-router-dom'

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

        <div className={styles.logo}>
            <img src={logo}/>
        </div>
        
        <p className={styles.logo} style={{fontSize:"28px"}}>Proximamente...</p>

        <Article id={1} name={"calzon"} category={"Ropa interior"} description={"Jean"} price={120} sizes={"S,M,L"} sex="" recently="" imageSrc="https://i.imgur.com/MXNGfKx.jpeg"/>

        <div style={{paddingTop:'16vw'}} />

        <Footer color='#000' backgroundColor='#b2afafff' copyrigth='Webpage created by GuilleNH' copyrightHref={credits}/>


    </>

}