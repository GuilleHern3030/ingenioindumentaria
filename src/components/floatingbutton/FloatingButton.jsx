import img from '../../assets/icons/whatsapp-icon2.webp'
import styles from './FloatingButton.module.css'
import useClientInfo from '../../hooks/useClientInfo'

export default function FloatingButton() {

    const { contactlink, dataLoaded } = useClientInfo()

    const handleFloatingButton = () => {
        if (dataLoaded)
            window.open(contactlink, "_blank")
    }

    return <nav className={styles.floatingbutton} onClick={handleFloatingButton}>
        <img src={img}/>
    </nav>

}