import { useEffect, useState } from 'react'
import styles from './Attributes.module.css'

import { Categories } from '@/api/objects/Categories'

import addIcon from '@/assets/icons/add.webp'
import removeIcon from '@/assets/icons/remover.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'

import { request } from '@/api'

import { selectByCategoriesCascade } from '@/api/attributes'

import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/Loading'

export default ({defaultAttributes=[], defaultCategories=[], onChange, t}) => {

    const [ dialog, setDialog ] = useState(null)

    const [ slug, setSlug ] = useState(null)

    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState()

    const [ attributes, setAttributes ] = useState([])
    useEffect(() => { onChange(attributes) }, [attributes])
    useEffect(() => {
        if (defaultAttributes?.length === 0) {
            let slugs; try { slugs = defaultCategories.map(category => category.slug) } catch(e) { slugs = [] }
            request(setIsLoading, setError, selectByCategoriesCascade, slugs, true)
            .then(attrs => {
                const attributes = attrs
                setAttributes(attrs)
            }) .catch(e => { console.error(e) })
        } else setAttributes(defaultAttributes)
    }, [ defaultAttributes, defaultCategories ])

    const handleRemove = (attr) => {
        setDialog(<Dialog
            title={t('editor_remove_attribute')}
            message={attr.name}
            onReject={() => setDialog(null)}
            onAccept={() => (removeAttribute(attr), setDialog(null), setSlug(null))}
            />
        )
    }

    const removeAttribute = (attr) => {
        if (attributes) {
            const indexOf = attributes.indexOf(attr)
            if (indexOf >= 0) {
                attributes.splice(indexOf, 1)
                setAttributes(attributes.slice())
            }
        }
    }

    const addAttribute = (attr) => {
        if (attributes) {
            if (attr && !attributes.includes(attr)) {
                attributes.push(attr)
                setAttributes(attributes.slice())
            }
        } else setAttributes([attr])
    }

    return <div className={styles.attributes}>

        { isLoading ? <Loading/> : 
          error ? <p className='error'>{error}</p> :
            <>
                { !attributes || attributes.length == 0 ? <p>{t('no_attributes_assigned')}</p> : <p style={{paddingBottom:'.8em'}}>{t('available_attributes')}</p> }

                { attributes && // Atributos ya establecidas
                    attributes.map((attr, index) =>
                        <div key={index} className={styles.attribute}>
                            <p className={styles.attr}>{attr.name}</p>
                            <img src={removeIcon} onClick={() => handleRemove(attr)}/>
                        </div>
                    )
                }

                {dialog}
            </>
        }

    </div>
    
}