import styles from './Alert.module.css'

import accept from '../../assets/icons/accept.webp'

export default function({title, message, onAccept, children}) {
    
    return <div className={styles.background} onClick={onAccept}>
            <div className={styles.confirmation} onClick={e => e.stopPropagation()}>
            <p className={`${styles.message} ${styles.title}`}>{title}</p>
            <p className={styles.message}>{message}</p>
            {children}
            <div className={styles.buttons}>
                <img className={styles.button} src={accept} onClick={onAccept}/>
            </div>
        </div>
    </div>

}