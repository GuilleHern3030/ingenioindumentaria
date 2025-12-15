import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Slug.module.css'
import StringUtils from '@/utils/StringUtils'
import IdUtils from '@/utils/IdUtils'
import { queryParams } from '@/hooks/useParams'
import { isAdmin } from '@/api'

export default ({ index, code }) => {

    const [ categories, setCategories ] = useState()
    const navigate = useNavigate()

    const handleIdClick = () => {
        if (isAdmin()) {
            const id = IdUtils.parse(index).id
            navigate(`/admin/products/${id}`,
                {
                    state: {
                        from: location.pathname
                    }
                }
            )
        }
    }

    useEffect(() => {
        const slug = StringUtils.slugToArray(IdUtils.parse(index).slug)
        const categories = []
        slug.forEach((slug, key) => {
            const category = StringUtils.lastSlug(slug)
            categories.push(<p key={key} onClick={() => navigate(`/category/${slug}${queryParams()}`)} className={styles.category}>{category}</p>)
            categories.push(<p key={key+slug.length} className={styles.separator}>/</p>)
        })
        categories.pop()
        setCategories(categories)
    }, [index])

    return <div className={styles.slug}>
        <div className={styles.categories}>
            {categories}
        </div>
        <p className={styles.id} onClick={handleIdClick}>{code}</p>
    </div>

}