import { useEffect, useState } from 'react'

import { selectAll } from '@/api/attributes'
import { request } from '@/api'

import styles from './AttributesList.module.css'
import Loading from '@/components/loading/LogoLoading'

export default ({prevAttributes, onAdd, t}) => {

    const [ isLoading, setIsLoading ] = useState()
    const [ error, setError ] = useState()
    const [ attributes, setAttributes ] = useState()

    useEffect(() => {
        request(setIsLoading, setError, selectAll)
        .then(attributes => {
            if (attributes?.length > 0) {
                const ids = prevAttributes.map(attribute => attribute.id)
                const unselectedAttributes = attributes.filter(attribute => !ids.includes(attribute.id))
                setAttributes(unselectedAttributes)
            } else throw new Error()
        }).catch(e => { 
            console.error(e)
            setError(t('no_attributes_to_add')) 
        })
    }, [])

    const handleSelect = (attribute) => {
        onAdd(attribute)
    }

    return isLoading ? <Loading/> : error ? <p>{error}</p> : <section>

        { attributes?.length > 0 &&
            attributes.map((attribute, index) => 
                <div key={index} className={styles.attribute}>
                    <p className={styles.attribute_name} onClick={() => handleSelect(attribute)}>{attribute.name}:</p>    
                    {
                        attribute.AttributeValues.map((value, key) => 
                            <p className={styles.value_name} key={key}>{value.name}</p>
                        )
                    }   
                </div>
            )  
        }

    </section>
}