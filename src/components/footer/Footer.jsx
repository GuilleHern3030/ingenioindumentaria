import { Link } from "react-router-dom"
import styles from './Footer.module.css'

import { credits, title } from '../../assets/data/data.json'

import useClientInfo from "../../hooks/useClientInfo"

import logo from "../../assets/icons/logo.webp"

import facebook from "../../assets/icons/facebook-icon.webp";
import instagram from "../../assets/icons/instagram-icon.webp";
import twitter from "../../assets/icons/twitter-icon.webp";

const goTop = () => window.scrollTo({top:0});

export default () => {

    const { data } = useClientInfo()

    return data == undefined ? null : <footer className={styles.footer}>

        <div className={styles.pagename_container}>
            <Link className={styles.pagename} to="/" onClick={()=>goTop()}>
                <img className={styles.logo} src={logo}/>
                <p>{title}</p>
            </Link>
        </div>

        <div className={styles.info}>
            { data.contactNumber ? <a href={data.contactlink} target="_BLANK">{data.contactNumber}</a> : <></> }
            { data.email ? <a className={styles.email} aria-label="email" href={`mailto:${data.email}?subject=IngenioIndumentaria"`}>{data.email}</a> : <></> }
            { data.address ? <a href={data.googlemaps} target="_BLANK">{data.address}</a> : <></> }
        </div>

        <div className={styles.social}>
            { data.facebook ? <a href={data.facebook} target="_BLANK"><img className={styles.icon} src={facebook}/></a> : <></> }
            { data.instagram ? <a href={data.instagram} target="_BLANK"><img className={styles.icon} src={instagram}/></a> : <></> }
            { data.twitter ? <a href={data.twitter} target="_BLANK"><img className={styles.icon} src={twitter}/></a> : <></> }
        </div>

        <div className={styles.privacy}>
            <Link to="/politics" onClick={()=>goTop()}>Aviso legal</Link>
            <a target="_BLANK" href={credits}>Webpage created by GuilleNH</a>
        </div>

    </footer>

}