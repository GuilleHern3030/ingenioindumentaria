import { useEffect, useState } from 'react'

import styles from './AttributesList.module.css'

import attribute from '@/api/models/Attribute'

export default ({ allAttributes, prevAttributes, onAdd, t }) => {

    const [ attributes, setAttributes ] = useState<attribute[]>()

    useEffect(() => {
        if (allAttributes?.length > 0) {
            const ids = prevAttributes.map((attribute:attribute) => attribute.id)
            const unselectedAttributes = allAttributes.filter((attribute:attribute) => !ids.includes(attribute.id))
            setAttributes(unselectedAttributes)
        } else throw new Error()
    }, [])

    const handleSelect = (attribute:attribute) => {
        onAdd(attribute)
    }

    return <section>

        { 
            attributes?.length > 0 ?
                attributes.map((attribute, index) => 
                    <div key={index} className={styles.attribute}>
                        <p className={styles.attribute_name} onClick={() => handleSelect(attribute)}>{attribute.name}:</p>    
                        {
                            attribute.values.map((value, key) => 
                                <p className={styles.value_name} key={key}>{value.name}</p>
                            )
                        }   
                    </div>
                )  
            : 
            <div className={styles.attribute}>
                <p>{t('no_attributes_to_add')}</p>
            </div>
        }

    </section>
}