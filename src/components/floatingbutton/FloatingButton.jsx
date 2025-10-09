import img from '../../assets/icons/whatsapp-icon.webp'
import styles from './FloatingButton.module.css'
import useData from '../../hooks/useData'

export default function FloatingButton() {

    const data = useData()

    const handleFloatingButton = () => {
        /*const params = ticketParams()
        const fullUrl = window.location.href
        const link = encodeURIComponent(fullUrl + "ticket" + params)
        
        if (params.length > 0)
            window.open(data.contactlink + "?text=Hola, quiero consultar por este producto: \n\r" + link, "_blank")
        else */
            window.open(data.contactlink, "_blank")
    }

    return <div className={styles.floatingbutton} onClick={handleFloatingButton}>
        <img src={img}/>
    </div>

}