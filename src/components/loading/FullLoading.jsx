import styles from './Loading.module.css'
import icon from '../../assets/icons/logo.webp'
import { useCommonI18n } from '@/hooks/useRouteI18N'

/**
 * 
 * @param {*|undefined} props 
 * @returns 
 */
export default function Loading({style, color, backgroundColor, className}) {
    const { t } = useCommonI18n()
    return <div className={`${styles.fullloading}  ${className ? className : ""}`}>
        <img className={`${styles.icon} ${styles.animation_size}`} src={icon}/>
        <p className={`${styles.text}`}>{t('common:loading')}</p>
    </div>
}