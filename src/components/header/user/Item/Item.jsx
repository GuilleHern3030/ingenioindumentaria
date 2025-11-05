import styles from './Item.module.css'
export default ({icon, text, onClick}) => 
    <div className={styles.container} onClick={onClick}>
        <img className={styles.icon} src={icon}/>
        <p className={styles.text}>{text}</p>
    </div>