import { useCommonI18n } from "@/hooks/useRouteI18N"
import styles from './Article.module.css'

import { useEffect, useState, useRef } from "react"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"

export default ({onClick}) => {

    const onLine = useOnlineStatus()
    const [ online, setOnline ] = useState(onLine)
    const [ wasItEverOffline, setWasItEverOffline] = useState(online === false)
    const { t } = useCommonI18n()

    useEffect(() => {
        if (onLine === false)
            setWasItEverOffline(true)
        setOnline(onLine)
    }, [ onLine ])

    return <div className={styles.empty}>
        <p>{ online && !wasItEverOffline ? t('error:no_articles') : t('error:no_articles_offline')}</p>
        <button 
            onClick={onClick}
            className="button_square_white">
                {t('common:search-other')}
        </button>
    </div>
}