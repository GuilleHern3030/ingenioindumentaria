import { useNavigate } from 'react-router-dom'
import styles from './Error.module.css'
import IdUtils from '@/utils/IdUtils'

export default ({ t }) => {

    const navigate = useNavigate()

    return <section className={styles.error}>
        <h2 className={styles.title}>{t('error_title')}</h2>
        <p className={styles.message}>{t('error_message_1')}</p>
        <p className={styles.message}>{t('error_message_2')}</p>
        <button 
            className={`button_square_white ${styles.button}`}
            onClick={() => navigate('/', { replace:true })}
            >{t('error_button')}
        </button>
    </section>

}