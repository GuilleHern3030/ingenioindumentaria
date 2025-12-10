import { useEffect, useLayoutEffect, useState } from 'react'
import styles from './Filters.module.css'

const MAX_TRIES = 50

import Filter from './Filter'

export const parseQueryFilters = (article, params) => {
    const filters = article.availableAttributes(params)
    return updateFilters(article, filters)
}

export const parseVariantId = (article, variantId) => {
    const filters = article.variants().getVariantFilters(variantId)
    return updateFilters(article, filters)
}

const updateFilters = (article, newFilters, oldFilters={}, attribute=undefined) => {

    if (newFilters && article) {
    
        let variants = article.selectVariants(newFilters)
        let tries = 0
        
        while (variants.length == 0 && Object.keys(newFilters).length > 1 && tries < MAX_TRIES) {
            tries++;
            const keys = Object.keys(newFilters)
            const key = keys[0] != attribute ? keys[0] : keys[1]
            delete newFilters[key]
            variants = article.selectVariants(newFilters)
        }

        if (tries >= MAX_TRIES)
            console.warn("[Filters] On changing filter", attribute, "to", value, "\nNo product variants founded in", tries, "tries")

        if (variants.length > 0) {
            if (variants.length == 1) {
                return variants[0].filters()
            } else return newFilters
        } else return oldFilters
    } else return oldFilters
}

// Component
export default ({article, filters, setFilters, onVariantChange}) => {

    const [ availableFilters, setAvailableFilters ] = useState()

    const [ attributes, setAttributes ] = useState(
        article.variants().availableAttributes()
        //useSelector(getAttributes(article.slugs()))
    )

    useEffect(() => {

        //console.log("[Filters] filters:", filters)
        //console.log("[Filters] original attributes:", attributes)

        if (filters && Object.keys(filters).length > 0)
            updateFilters(article, filters)

    }, [])

    useLayoutEffect(() => {

        const variants = article.selectVariants(filters)
        const attributes = variants.availableAttributes()
        
        if (variants.length === 1) {
            const variant = variants[0]
            variant.setParent(article.toJson())
            onVariantChange(variant)
        }

        setAvailableFilters(attributes)

    }, [filters])

    const handleOnChange = (attribute, value) => {

        const oldFilters = { ...filters }
        
        filters[attribute] = value ?? undefined
        if (filters[attribute] === undefined)
            try { delete filters[attribute] } catch(e) { }

        const newFilters = { ...filters }

        setFilters(updateFilters(article, newFilters, oldFilters, attribute))

    }

    return article.variants()?.length > 0 && availableFilters && <>
        { article.slugs()?.length > 0 && <hr className={styles.hr}/> }
        { attributes && Object.entries(attributes).map(([attribute, values], key) => 
                <Filter 
                    key={key}
                    filters={filters}
                    attribute={attribute} 
                    values={values ?? []}
                    prevValue={filters[attribute]}
                    availables={availableFilters[attribute]}
                    onChange={handleOnChange}
                />
            )
        }
    </>

}