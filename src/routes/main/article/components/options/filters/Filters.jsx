import { useEffect, useLayoutEffect, useState } from 'react'
import styles from './Filters.module.css'

const MAX_TRIES = 50

import Filter from './Filter'

import FilterUtils from '../../../utils/FilterUtils'

// Component
export default ({ article, filters, onChange, onClean, t }) => {

    const [ availableFilters, setAvailableFilters ] = useState()
    const [ attributes, setAttributes ] = useState( FilterUtils.availableAttributes(article) )

    useLayoutEffect(() => { setAvailableFilters(FilterUtils.availableFilters(article, filters)) }, [filters])

    const handleOnChange = (attribute, value, available) => {

        if (available) {

            const oldFilters = { ...filters }
            
            oldFilters[attribute] = value ?? undefined
            if (oldFilters[attribute] === undefined)
                try { delete oldFilters[attribute] } catch(e) { }

            const newFilters = { ...oldFilters }

            console.log("NewFilters:", newFilters)

            onChange(newFilters)

        } else {
            const resetFilters = {}
            resetFilters[attribute] = value
            onChange(resetFilters)
        }

    }

    return article.variants?.length > 0 && availableFilters && <div className={styles.filters}>
        <hr className={styles.hr}/>
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
        <p className={styles.clean} onClick={onClean}>{t('clean_filters')}</p>
    </div>

}