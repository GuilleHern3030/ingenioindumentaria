import { useEffect, useState } from 'react'

import removeIcon from '@/assets/icons/remover.webp'

import styles from './AttributesPreview.module.css'

import Dialog from '@/components/dialog/Dialog';

import attribute from '@/api/models/Attribute';

export default ({
    attributes, 
    onSelect,
    onRemove,
    asked,
    t}) => {

    const [ attributeSelected, setAttributeSelected ] = useState<attribute>()
    const [ dialog, setDialog ] = useState(null)

    useEffect(() => { close() }, [ attributeSelected ])

    // --- Attributes editor --- //

    const handleRemove = (attribute:attribute, e) => {
        e.stopPropagation()
        const finish = () => {
            setDialog(null)
            onRemove(attribute)
            close(true)
        }
        !asked ? setDialog(<Dialog
            title={t('attribute_remove_title')}
            message={t('attribute_remove_message')}
            onReject={() => setDialog(undefined)}
            onAccept={finish} children={undefined}
        />) : finish()
    }

    // --- Auxiliary function --- //

    const handleSelect = (attribute:attribute) => {
        onSelect()
        if (attributeSelected?.name == attribute?.name)
            setAttributeSelected(undefined)
        else setAttributeSelected(attribute)
    }

    const close = (deselect = false) => {
        if (deselect == true)
            setAttributeSelected(undefined)
    }

    // --- React Component --- //

    return <div className={styles.attributes}>
        { 
            attributes?.length > 0 ? attributes?.map((attribute:attribute, key:number) => !attribute ? <></> :
            <article key={key}>
                
                <div className={styles.attribute} onClick={() => handleSelect(attribute)}>
                    <p 
                        className={`${attribute?.disabled === false ? styles.active : styles.inactive}`}
                        >{attribute.name}
                    </p>
                    <img 
                        className={styles.img} 
                        src={removeIcon}
                        onClick={e => handleRemove(attribute, e)}
                    />
                </div>

                { attributeSelected?.name == attribute?.name &&
                    <div className={styles.details}>
                        { attributeSelected.values?.length > 0 ? attributeSelected.values.map((value, key) => 
                            <p 
                                key={key}
                                className={`${styles.value} ${value.disabled ? styles.disabled : ''}`}
                                >{value.name}
                            </p>
                        ) : <p className={styles.empty_values}>{t('values_empty')}</p>}
                    </div>
                }

            </article>
        ) : <p className={`${styles.value} ${styles.disabled}`}>{t('attributes_empty')}</p>}

        { dialog }

    </div>
}