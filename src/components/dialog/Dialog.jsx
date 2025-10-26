import styles from './Dialog.module.css'

import accept from '../../assets/icons/accept.webp'
import cancel from '../../assets/icons/cancel.webp'

export default function({title, message, onAccept, onReject}) {
    
    return <div className={styles.background}>
            <div className={styles.confirmation}>
            <p className={`${styles.message} ${styles.title}`}>{title}</p>
            <p className={styles.message}>{message}</p>
            <div className={styles.buttons}>
                <img className={styles.button} src={cancel} onClick={onReject}/>
                <img className={styles.button} src={accept} onClick={onAccept}/>
            </div>
        </div>
    </div>

}