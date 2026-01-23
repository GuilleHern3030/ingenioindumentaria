import { useState } from 'react'

import styles from './Options.module.css'

import Filters from './filters/Filters'

import FilterUtils from '../../utils/FilterUtils'
import Articles from './articles/Articles'

export default ({ article, variant, categories, onSelect, t }) => {

    const [ filters, setFilters ] = useState({})
    const [ variants, setVariants ] = useState(article.variants)

    const handleFiltersChange = (filters) => {
        const filteredVariants = FilterUtils.selectVariants(article, filters)
        setFilters(filters)
        setVariants(filteredVariants)
        console.log("[Options] filters:", filters)
        console.log("[Options] filteredVariants:", filteredVariants)
        if (filteredVariants.length == 1) {
            const variant = filteredVariants[0]
            onSelect(variant)
            setFilters(FilterUtils.getFilters(variant))
        }
    }

    const handleFiltersClean = () => {
        setFilters({})
        setVariants(article.variants)
    }

    return article.variants.length > 1 && <section className={styles.options}>

        <h2 className={styles.title}>{t('options')}</h2>

        { 
            <>
                <Filters
                    article={article}
                    filters={filters}
                    onChange={handleFiltersChange}
                    onClean={handleFiltersClean}
                    t={t}
                />
                
                <Articles
                    articles={variants}
                    variant={variant}
                    onSelect={onSelect}
                    alt={article.images[0].src}
                /> 
            </>
        }

    </section>

}