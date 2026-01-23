import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Attributes.module.css'

import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/Loading'

import useUser from '@/hooks/useUser'

import CategoryUtils from '../utils/CategoryUtils'

export default ({ categories, category, t }) => 
    category ? <CategoryAttributes categories={categories} category={category} t={t}/>
    : <GlobalAttributes categories={categories} t={t}/>

const CategoryAttributes = ({ categories, category, t }) => {

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate('attributes',
            {
                state: {
                    categories,
                    slug: category.slug
                }
            }
        )
    }
    

    return <>
        <div className='flex-center-column'>
            <p className={styles.subtitle}>{t('attributes')}</p>
            <AttributesList attributes={CategoryUtils.find(categories, category.slug)?.attributes ?? []} t={t}/>
            <button 
                className={styles.button} 
                onClick={handleNavigate}
                >{`${category ? t('attributes_set') : t('attributes_set_global') }`}
            </button> 
        </div>
        <hr/>
    </>

}

const GlobalAttributes = ({ categories, t }) => {

}

const AttributesList = ({ attributes, t }) => {

    const [ selected, setSelected ] = useState(null)

    const Values = (values) => 
        values?.length > 0 ? values.map((value, key) => 
            <p key={key} className={value.disabled !== true ? styles.value_active : styles.value_inactive}>{value.name}</p>
        ) : <p className={styles.empty}>{t('values_empty')}</p>

    return <div className={styles.attributes}>
        { attributes?.length > 0 ? attributes.map((attribute, index) => 
            <div 
                key={index} 
                className={`${styles.attribute} ${attribute.disabled == true ? styles.attribute_disabled : ''} ${selected == index ? styles.attribute_selected : styles.attribute_unselected}`} 
                onClick={() => setSelected(prev => prev == index ? null : index)}>
                <p className={attribute.disabled == true ? styles.attribute_disabled : null}>{attribute.name}</p>
                { selected == index && 
                    <div>
                        <hr className={styles.hr}/>
                        { Values(attribute.values) }
                    </div>
                }
            </div>
        ) : <p className={styles.empty}>{t('attributes_empty')}</p> }
    </div>
}