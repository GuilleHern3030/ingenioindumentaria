import { useEffect, useState } from 'react'

import styles from './Filters.module.css'

import FilterUtils from '../../utils/FilterUtils'

export default ({ variant }) => {

    const [ filters, setFilters ] = useState({})

    useEffect(() => {
        setFilters(FilterUtils.getFilters(variant))
    }, [ variant ])

    return <div className={styles.filters}>
        { 
            Object.entries(filters).map(([attributeName, valueName], key) => 
                <p className={styles.line} key={key}>
                    <span className={styles.attribute}>{attributeName}</span>
                    <span className={styles.value}>{valueName}</span>
                </p>
            )
        }
    </div>

}
