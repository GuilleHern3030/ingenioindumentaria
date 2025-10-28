import { useNavigate } from 'react-router-dom'
import styles from './Admin.module.css'

export default () => {

    const navigate = useNavigate()

    return <div className={styles.list}>
        <button className={styles.button} onClick={() => navigate("/admin/products")}>Articulos</button>
        <button className={styles.button} onClick={() => navigate("/admin/messages")}>Mensajes</button>
    </div>
}