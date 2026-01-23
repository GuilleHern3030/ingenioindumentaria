import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Collection.module.css'

import StringUtils from '@/utils/StringUtils'
import { isAdmin } from '@/api'

export default ({className, slug, articlesCount, t}) => {

    const [ collection, setCollection ] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) setCollection(StringUtils.slugToCollection(slug))
        else setCollection(t(location.pathname.replaceAll('/', '')))
    }, [location.pathname])

    const handleOnCollectionClick = () => {
        /*if (isAdmin() && slug) 
            navigate(`/admin/categories/attributes?category=${slug}`)*/
    }

    return <section className={className} onClick={handleOnCollectionClick}>
        { collection != undefined && <p className={styles.name}>{`${t("collection")} ${collection}`}</p> }
        { articlesCount > 0 && <p className={styles.count}>{`${articlesCount} ${t("articles")}`}</p> }
    </section>

}