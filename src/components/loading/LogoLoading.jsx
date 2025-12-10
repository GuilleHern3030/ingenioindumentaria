import styles from './Loading.module.css'
import icon from '../../assets/icons/logo.webp'
export default function Loading({style, color, backgroundColor, className}) {
    return <div className={`${styles.logo} ${className ? className : ""}`}>
        <img className={`${styles.icon} ${styles.animation_size}`} src={icon}/>
    </div>
}