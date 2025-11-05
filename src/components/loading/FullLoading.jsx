import styles from './Loading.module.css'
import icon from '../../assets/icons/logo.webp'
/*export default function Loading({style, color, backgroundColor, className}) {
    return <div className={styles.fullloading}>
        <img className={styles.icon} src={icon}/>
        <div 
        className={`${styles.spinner} ${className ? className : ""}`} 
        style={{
            borderColor: color,
            borderLeftColor: backgroundColor,
            ...style
        }}/>
    </div>
}*/

export default function Loading({style, color, backgroundColor, className}) {
    return <div className={`${styles.fullloading}`}>
        <img className={`${styles.icon} ${styles.animation_size}`} src={icon}/>
        <p className={`${styles.text}`}>Cargando</p>
    </div>
}