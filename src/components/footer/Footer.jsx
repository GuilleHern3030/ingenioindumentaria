import facebookIcon from "../../assets/icons/facebook-icon.webp";
import instagramIcon from "../../assets/icons/instagram-icon.webp";
import threadsIcon from "../../assets/icons/threads-icon.webp";
import twitterIcon from "../../assets/icons/twitter-icon.webp";

import useData from "../../hooks/useData"

import styles from './Footer.module.css';

export default function Footer({children, copyrigth, color="#e8e8e8", backgroundColor="#3f3e3ec3", useStoredData=true, copyrightHref=undefined}) {

    const data = useData()

    if (data == undefined) return null;

    if (children !== undefined) 
        return (
            <footer className={styles.footer} style={{backgroundColor:backgroundColor}}>
                <div className={styles.container}>
                    { children }   
                </div> 
                { copyrigth ? (<p className={styles.copyright}>{copyrigth}</p>) : (<></>) }
            </footer>
        );

    else if(useStoredData) try {

        return (
            <footer className={styles.footer} style={{backgroundColor:backgroundColor}}>
                <div className={styles.container}>
                    <div className={styles.contact} style={{color:color}}>
                        <p className={styles.title} style={{color:color}}>Contacto</p>
                    </div>
                    <div className={styles.contact} style={{color:color}}>
                        { (data.email) ? <a style={{color:color}} aria-label="email" href={`mailto:${data.email}?subject=Mail from homepage`}>{data.email}</a> : (<></>) }
                        { (data.contactNumber) ? <a style={{color:color}} href={data.contactlink} target="_BLANK">{data.contactNumber}</a> : (<></>) }
                        { (data.googlemaps) ? <a style={{color:color}} href={data.googlemaps} target="_BLANK">{data.direction}</a> : (<></>) }
                        { (data.location) ? <p style={{color:color}}>{data.location}</p> : (<></>) }
                        { (data.country) ? <p style={{color:color}}>{data.country}</p> : (<></>) }
                    </div>
                    <div className={styles.social}>
                        { (data.facebook) ? <a href={data.facebook} style={{color:color}}><img src={facebookIcon} alt="Facebook"/></a> : (<></>) }
                        { (data.instagram) ? <a href={data.instagram} style={{color:color}}><img src={instagramIcon} alt="Instragram"/></a> : (<></>) }
                        { (data.threads) ? <a href={data.threads} style={{color:color}}><img src={threadsIcon} alt="Threads"/></a> : (<></>) }
                        { (data.twitter) ? <a href={data.twitter} style={{color:color}}><img src={twitterIcon} alt="Twitter"/></a> : (<></>) }
                        {/* (data.discord) ? <a href={data.discord} style={{color:color}}><img src={discordIcon} alt="Discord"/></a> : (<></>) */}
                    </div>
                </div>
                { 
                    copyrigth ? 
                        copyrightHref == undefined ?
                            (<p className={styles.copyright} style={{color:color}}>{copyrigth}</p>) 
                            : (<a className={styles.copyright} style={{color:color}} href={copyrightHref}>{copyrigth}</a>) 
                    : (<></>) 
                }
            </footer>
        );
    }

    catch(e) { 
        console.warn(e)
        return (
            <footer className={styles.footer} style={{backgroundColor:backgroundColor}}>
                { 
                    copyrigth ? 
                        copyrightHref == undefined ?
                            (<p className={styles.copyright} style={{color:color}}>{copyrigth}</p>) 
                            : (<a className={styles.copyright} style={{color:color}} href={copyrightHref}>{copyrigth}</a>) 
                    : (<></>) 
                    // copyrigth ? (<p className={styles.copyright}>{copyrigth}</p>) : (<></>) 
                }
            </footer>
        );
    }
}