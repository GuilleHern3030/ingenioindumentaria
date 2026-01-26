import styles from './Reload.module.css'
import { reload } from '@/api'

import icon from '@/assets/icons/sync.webp'

export default ({className=undefined, onClick}) => {
    return <div className={`${styles.reload} ${className && className}`} >
        <img src={icon} onClick={onClick}/>
    </div>
}