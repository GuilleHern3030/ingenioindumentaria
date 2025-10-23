import { useState } from "react"
import { Link } from "react-router-dom"

import styles from "./Products.module.css"

import useIndexedDB from "../../../hooks/useIndexedDB"

import Header from "../../../components/header/Header"
import Dialog from "../../../components/dialog/Dialog"
import Loading from "../../../components/loading/Loading"

import logo from '../../../assets/icons/logo.webp'
import Catalog from "../../../components/admin/products/Index"

export default function() {

    const [ dialog, setDialog ] = useState()    
    //const initialized = useRef(false)
    
    const { isLoading, database } = useIndexedDB()

    const handleReload = confirmed => {

        if (confirmed == undefined) {
            setDialog(
                <Dialog
                    title={"¿Deseas recargar el catálogo?"}
                    onAccept={() => handleReload(true)}
                    onReject={() => handleReload(false)}
                />
            )
            return;
        } 

        else if (confirmed === true) { // accepted
            database.pull()
        }

        setDialog(undefined)
    }

    /*useEffect(() => {
        if (initialized.current) return; // evita múltiples ejecuciones
        initialized.current = true;
        database.pull()
    }, [])*/

    return <>
        { dialog ? dialog : <></> }
        <>

            <Header 
                pageName={"Administración"}
                colorOnScroll='#1f1f1fff'
                logo={logo}
                mainLink={null}
                changeBackgroundOnScroll={false}>
                <Link to="/admin/products"> Artículos </Link>
                <Link to="/admin/messages"> Mensajes </Link>
            </Header>

            {/*<header className={styles.header}>
                <div className={styles.header__logo}>
                    <img className={styles.logo} src={logo}/>
                    <p><span>Panel administrativo</span></p>
                </div>
            </header>*/}

            <main className={styles.main}> { 
                isLoading === true ? 
                <Loading/> :
                <Catalog reload={() => handleReload(true)}/>
            }
            </main>

            <footer className={styles.footer}>
                <button className={styles.footer__button} onClick={() => handleReload()}>Recargar catálogo</button>
            </footer>

        </>
    </>

}