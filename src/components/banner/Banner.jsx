import styles from './Banner.module.css'

export default ({ text, online }) => {
    if (online === undefined || online === null) return null
    return <aside className={`${online ? styles.online : styles.offline} ${styles.banner}`}>
        <p className={styles.text}>{text}</p>
    </aside>
}