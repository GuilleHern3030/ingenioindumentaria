import { useState } from "react";

import styles from "./Contact.module.css"

import { sendMessage } from "../../api/messages.ts"
import useData from "../../hooks/useData";

// Images
import whatsapp from "../../assets/icons/whatsapp-icon.webp";
import facebook from "../../assets/icons/facebook-icon.webp";
import instagram from "../../assets/icons/instagram-icon.webp";
import twitter from "../../assets/icons/twitter-icon.webp";
import logo from "../../assets/icons/logo.webp"

// Components
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import Loading from "../../components/loading/Loading"


export default () => {

    const [ warning, setWarning ] = useState()
    const [ isSending, setIsSending ] = useState(false)

    const handleSubmit = formEvent => {
        formEvent.preventDefault()
        setIsSending(true)
        sendMessage(formEvent)
        .then(() => {
            setWarning("") 
            setIsSending(false)
            alert("El mensaje fue enviado exitosamente")
        })
        .catch(e => { 
            console.warn(e)
            setWarning(e) 
            setIsSending(false)
        })
    }

    const data = useData()
    
    return data == undefined ? null : <>

        <Header/>

        <main className={styles.main}>
            <section className={styles.sectionwhite}>
                
                <article className={styles.article} style={{backgroundColor:"#dcd9d9ff"}}>
                    <p className={styles.title}><span>Medio de contacto</span></p>
                    <p>Podés contactarnos a través de nuestro WhatsApp</p>
                    <a target="_BLANK" href={data.contactlink}><img className={`${styles.icon} ${styles.preferredcontact}`} src={whatsapp}/></a>
                </article>
                
                <article className={styles.article} style={{backgroundColor:"#dcd9d9ff"}}>
                    <p className={styles.title}><span>Nuestras redes sociales</span></p>
                    <p>También podés encontrarnos en nuestras redes sociales</p>
                    <div className={styles.social}>
                        { data.facebook ? <a target="_BLANK" href={data.facebook}><img className={styles.icon} src={facebook}/></a> : <></> }
                        { data.instagram ? <a target="_BLANK" href={data.instagram}><img className={styles.icon} src={instagram}/></a> : <></> }
                        { data.twitter ? <a target="_BLANK" href={data.twitter}><img className={styles.icon} src={twitter}/></a> : <></> }
                    </div>
                </article>
                
                <article className={styles.article} style={{backgroundColor:"#dcd9d9ff"}}>
                    <p className={styles.title}><span>Correo electrónico</span></p>
                    <p style={{marginBottom:'.7em'}}>Contactarnos por email</p>
                    <a className={styles.email} aria-label="email" href={`mailto:${data.email}?subject=CenitEspecias"`}>{data.email}</a>
                </article>
                
                <article className={styles.article} style={{backgroundColor:"#dcd9d9ff"}}>
                    <p className={styles.title}><span>Mensaje</span></p>
                    <p>También podés dejarnos un mensaje acá mismo</p>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <p className={styles.label}>Nombre</p>
                        <input className={styles.input} name="sender" placeholder="Tu nombre" required=""/>
                        <p className={styles.label}>Email</p>
                        <input className={styles.input} name="email" placeholder="Un correo de contacto"/>
                        <p className={styles.label}>Teléfono</p>
                        <input className={styles.input} name="phone" placeholder="Un número de contacto"/>
                        <p className={styles.label}>Mensaje</p>
                        <textarea className={`${styles.input} ${styles.textarea}`} name="message" placeholder="Tu consulta"/>
                        <p className={styles.warning}>{warning}</p>
                        <div className={styles.submitcontainer}>
                            { isSending === true ? <Loading/> :
                                <button className={styles.submit}>Enviar consulta</button>
                            }
                        </div>
                    </form>
                </article>

            </section>

            <section className={styles.photo}>
                <img src={logo}/>
            </section>
        </main>

        <Footer/>

    </>
}