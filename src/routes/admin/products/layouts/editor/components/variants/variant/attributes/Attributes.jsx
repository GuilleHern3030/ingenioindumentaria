import { useEffect, useState } from 'react'
import styles from './Attributes.module.css'

import addIcon from '@/assets/icons/add.webp'
import removeIcon from '@/assets/icons/remover.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'

import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/Loading'

import useProductData from '../../../../hooks/useProductData'

// selectedAttributes = [ { attributeId: valueId } ]
export default ({ slugs, selectedAttributes, onAdd, onRemove, t, editable = true }) => {

    const { attributes, categories } = useProductData()

    const [ dialog, setDialog ] = useState(null)
    const [ firstRemove, setFirstRemove ] = useState(true)
    const [ menu, setMenu ] = useState(null)

    const [ extraAttributes, setExtraAttributes ] = useState([])
    const [ selectableAttributes, setSelectableAttributes ] = useState([])

    useEffect(() => {
        const selectableAttributes = getSelectableAttributes(attributes, categories, slugs, selectedAttributes)
        const extraAttributes = getExtraAttributes(attributes, categories, slugs, selectedAttributes)
        setSelectableAttributes(selectableAttributes)
        setExtraAttributes(extraAttributes)
        setMenu(null)
    }, [ selectedAttributes, attributes, categories, slugs ])

    const handleRemove = (attr) => {
        const remove = () => (onRemove(attr), setDialog(null), setMenu(null), setFirstRemove(false))
        firstRemove ? setDialog(<Dialog
            title={t('editor_remove_attribute')}
            message={attr.name}
            onReject={() => setDialog(null)}
            onAccept={remove}
            />
        ) : remove()
    }

    return <>
        <h6>{t('attributes')}</h6>
        <section className={styles.attributes}>

            { 
                menu ? <></> :
                selectedAttributes?.length === 0 ? <p>{t('no_attributes_assigned')}</p> :
                <>
                    <p style={{paddingBottom:'.8em'}}>{t('attributes_assigned')}</p>
                    {
                        selectedAttributes.map((attr, index) =>
                            <div key={index} className={styles.attribute}>
                                <p className={styles.attrs}>{attr.attributeName}</p>
                                <p className={styles.vals}>{attr.valueName}</p>
                                <img src={removeIcon} onClick={() => handleRemove(attr)}/>
                            </div>
                        )
                    }
                </>
            }

            { menu }

            { !menu && editable && attributes?.length > 0 && 
                <div className={styles.add}>
                    <img 
                        src={addIcon} 
                        onClick={() => setMenu(
                            <AttributesList
                                slugAttributes={selectableAttributes} 
                                noSlugAttributes={extraAttributes}
                                onClick={attribute => setMenu(
                                    <ValuesList 
                                        attribute={attribute}
                                        values={attribute.values}
                                        onClose={() => setMenu(null)}
                                        onSelect={(attributeValue) => {
                                            onAdd(attributeValue)
                                            setMenu(null)
                                            setFirstRemove(true)
                                        }}
                                        t={t}
                                    />
                                )}
                                onClose={() => setMenu(null)}
                                t={t}
                            />
                        )}
                    />
                </div>
            }

            { dialog }

        </section>
    </>
    
}

const AttributesList = ({ slugAttributes, noSlugAttributes, onClick, onClose, t }) => {

    return <>

        { slugAttributes?.length > 0 && 
            <div style={{paddingBottom:'.8em'}}>
                <p style={{paddingBottom:'.4em'}}>{t('available_attributes')}</p>
                {
                    slugAttributes.map((attr, index) =>
                        <div key={index} className={styles.attribute}>
                            <p className={styles.attr} onClick={() => onClick(attr)}>{attr.name}</p>
                        </div>
                    )
                }
            </div>
        }

        { noSlugAttributes?.length > 0 && 
            <div>
                <p style={{paddingBottom:'.4em'}}>{t('available_extra_attributes')}</p>
                {
                    noSlugAttributes.map((attr, index) =>
                        <div key={index} className={styles.attribute}>
                            <p className={styles.attr} onClick={() => onClick(attr)}>{attr.name}</p>
                        </div>
                    )
                }
            </div>
        }

        { noSlugAttributes?.length == 0 && slugAttributes?.length == 0 && <p>{t('no_attributes_available')}</p> }
        
        { 
            <div className={styles.add}>
                <img 
                    src={cancelIcon} 
                    onClick={onClose}
                />
            </div>
        }

    </>

}

const ValuesList = ({ attribute, values, onSelect, onClose, t }) => {

    const handleSelect = (value) => {
        const selection = {
            attributeId: attribute.id,
            attributeName: attribute.name,
            valueId: value.id,
            valueName: value.name
        }
        console.log(selection)
        onSelect(selection)
    }

    return <>

        { values?.length > 0 ?
            <div style={{paddingBottom:'.8em'}}>
                <p style={{paddingBottom:'.4em'}}>{t('available_attributes')}</p>
                {
                    values.map((value, index) =>
                        <div key={index} className={styles.attribute}>
                            <p className={styles.attr} onClick={() => handleSelect(value)}>{value.name}</p>
                        </div>
                    )
                }
            </div> : <p style={{paddingBottom:'.4em'}}>{t('no_attributes_available')}</p>
        }

        { 
            <div className={styles.add}>
                <img 
                    src={cancelIcon} 
                    onClick={onClose}
                />
            </div>
        }
    </>
}

const getSelectableAttributes = (attributes, categories, slugs, selectedAttributes) => {
    const attributesId = new Set()
    slugs.forEach(slug => {
        const category = categories.find(category => category.slug == slug)
        if (category) category.attributes.forEach(attribute => attributesId.add(attribute))
    })
    const unselectedAttributes = [ ...attributesId ].filter(id => !selectedAttributes.find(selectedAttribute => selectedAttribute.attributeId == id))
    return unselectedAttributes.map(id => attributes.find(attribute => attribute.id == id))
}

const getExtraAttributes = (attributes, categories, slugs, selectedAttributes) => {
    const selectableAttributes = getSelectableAttributes(attributes, categories, slugs, selectedAttributes)
    return attributes.filter(attribute => 
        !selectableAttributes.find(selectableAttribute => selectableAttribute.id == attribute.id)
        && !selectedAttributes.find(selectedAttribute => selectedAttribute.attributeId == attribute.id)
    )
}