import styles from './index.module.css'

export default ({className, onClick}) => 
    <div onClick={onClick} className={`${className} ${styles.cross}`}>
        <span></span>
        <span></span>
    </div>