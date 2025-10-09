import { Link } from "react-router-dom";

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

import whtasappIcon from '../../assets/icons/whatsapp-icon.webp';
import facebookIcon from "../../assets/icons/facebook-icon.webp";
import instagramIcon from "../../assets/icons/instagram-icon.webp";
import threadsIcon from "../../assets/icons/threads-icon.webp";
import twitterIcon from "../../assets/icons/twitter-icon.webp";

import logo from '../../assets/images/logo.jpeg'
import styles from "./Contact.module.css";

import { title } from "../../data/client-info.json";
import { credits } from "../../data/references.json";

import useData from "../../hooks/useData";

export default function Contact() {

    const data = useData()

    const handleWhatsApp = () => 
        window.open(data.contactlink, "_blank")

    return (<div>
        <Header pageName={title}>
            <Link to="/about"> Nosotros </Link>
            <Link to="/contact"> Contacto </Link>
        </Header>

        <div className={styles.logo}>
            <img src={logo}/>
        </div>
   
        <div className={styles.contact}>
            <p className={styles.instructions}>Hola! Muchas gracias por visitarnos.</p>

                { /*data ? <><p className={styles.instructions}>Puedes contactarnos por medio de nuestro correo electrónico:</p>
                    <div className={styles.gmail}>
                        <div className={styles.wame_animation}>
                            <a className={styles.emaillink} aria-label="email" href={`mailto:${data.email}?subject=Contact from ${title}`}><p className={styles.instructions}>{data.email}</p></a>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </>: null*/}

            <p className={styles.instructions}>Puedes escribirnos a nuestro whatsapp:</p>
            <div className={styles.wame}>
                <div className={styles.wame_animation} onClick={handleWhatsApp}>
                    <img src={whtasappIcon} alt="Whatsapp"/>
                </div>
            </div>

            <br/>

            { data ? <>
                <p className={styles.instructions}>O bien, visitarnos en nuestras redes sociales.</p>
                { (data.facebook) ? <div className={styles.wame}><div className={styles.wame_animation}><a href={data.facebook}><img src={facebookIcon} alt="Facebook"/></a></div></div> : (<></>) }
                { (data.instagram) ? <div className={styles.wame}><div className={styles.wame_animation}><a href={data.instagram}><img src={instagramIcon} alt="Instragram"/></a></div></div> : (<></>) }
                { (data.threads) ? <div className={styles.wame}><div className={styles.wame_animation}><a href={data.threads}><img src={threadsIcon} alt="Threads"/></a></div></div> : (<></>) }
                { (data.twitter) ? <div className={styles.wame}><div className={styles.wame_animation}><a href={data.twitter}><img src={twitterIcon} alt="Twitter"/></a></div></div> : (<></>) }
            </> : null}                 
        </div>

        <Footer color='#000' backgroundColor='#b2afafff' copyrigth='Webpage created by GuilleNH' copyrightHref={credits}/>

    </div>);
}