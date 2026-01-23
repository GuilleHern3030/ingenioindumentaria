import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Attributes.module.css'
import StringUtils from '@/utils/StringUtils'

import contractIcon from '@/assets/icons/cross.webp'

import Attribute from '../attribute/Attribute'


export default ({ attributes, slug, title, onAttributeSelected, defaultContracted=false, hide=false, t }) => {

    const [ contracted, setContracted ] = useState(defaultContracted)

    const [ attributesList, setAttributesList] = useState([])

    useEffect(() => { 
        if (attributes) {
            const attributesFiltered = attributes.filterSlug(slug)
            console.log(attributesFiltered)
            setAttributesList(attributesFiltered) 
            setContracted(defaultContracted)
        }
    }, [ slug ])

    return attributesList && <div style={{display: hide === false ? 'block' : 'none'}}>
        <div className={styles.title}>
            <div></div>
            <p>{StringUtils.lastSlug(title)}</p>
            <div className={styles.contract}>
                { !contracted && attributesList.length > 0 && <img src={contractIcon} onClick={() => setContracted(true)}/> }
            </div>
        </div>
        { 
            attributesList.length > 0 && contracted === true ?
                <p 
                    onClick={() => setContracted(false)}
                    className={styles.contracted}>{t('contracted_text')}
                </p>
            :
            
            attributesList.length > 0 ?
                <section className={styles.attributes}>
                    
                    {
                        attributesList.map((attribute, index) =>
                            <Attribute key={index} attribute={attribute} onAttributeSelected={onAttributeSelected} t={t} />
                        )
                    }
                </section> 

            : 

            <p className={styles.empty}>{t('no_products_in_category')}</p>
        }
    </div>
}