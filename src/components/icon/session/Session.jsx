import styles from './Session.module.css'

export default ({ onClick, src, text, width="max-content" }) => {
    return <div
        className={styles.googleLikeButton}
        style={{width}}
        role="button"
        onClick={onClick}
    >
        <img className={styles.icon} src={src} alt=""  />
        <span className={styles.text}>{text}</span>
    </div>
}