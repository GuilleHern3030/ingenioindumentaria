import { useCommonI18n } from "@/hooks/useRouteI18N"
import styles from './Article.module.css'

export default () => {

    const { t } = useCommonI18n()

    return <div>
        <p className={styles.empty}>{t('error:no_articles')}</p>
    </div>
}