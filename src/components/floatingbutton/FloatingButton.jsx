import img from '../../assets/icons/whatsapp-icon2.webp'
import styles from './FloatingButton.module.css'
import useClientInfo from '../../hooks/useClientInfo'

export default function FloatingButton() {

    const { data } = useClientInfo()

    const handleFloatingButton = () => {
        /*const params = ticketParams()
        const fullUrl = window.location.href
        const link = encodeURIComponent(fullUrl + "ticket" + params)
        
        if (params.length > 0)
            window.open(data.contactlink + "?text=Hola, quiero consultar por este producto: \n\r" + link, "_blank")
        else */
            window.open(data.contactlink, "_blank")
    }

    return <nav className={styles.floatingbutton} onClick={handleFloatingButton}>
        <img src={img}/>
    </nav>

}