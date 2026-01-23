import { useCommonI18n } from "@/hooks/useRouteI18N"
import styles from './Article.module.css'

export default ({onClick}) => {

    const { t } = useCommonI18n()

    return <div className={styles.empty}>
        <p>{t('error:no_articles')}</p>
        <button 
            onClick={onClick}
            className="button_square_white">
                {t('common:search-other')}
        </button>
    </div>
}