import { useEffect, useState, useRef } from 'react'
import { useOutletContext } from "react-router-dom";
import useParams from '@/hooks/useParams';

import addIcon from '@/assets/icons/add.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'
import removeIcon from '@/assets/icons/remover.webp'

import styles from './Attributes.module.css'

import { Attribute } from '@/api/objects/Attribute';

import Loading from '@/components/loading/Loading.jsx'
import Reload from '../../../../components/reload/Reload.jsx'
import Input from '../../../../components/input/Input';
import Dialog from '@/components/dialog/Dialog';
import StringUtils from '@/utils/StringUtils';

export default ({
    attributes, 
    onSelect,
    onRemove,
    t}) => {

    const [ attributeSelected, setAttributeSelected ] = useState()
    const [ dialog, setDialog ] = useState(null)
    const nameRef = useRef()

    useEffect(() => { close() }, [ attributeSelected ])

    // --- Attributes editor --- //

    const handleRemove = (attribute, e) => {
        e.stopPropagation()
        setDialog(<Dialog
            title={t('attribute_remove_title')}
            message={t('attribute_remove_message')}
            onReject={() => setDialog(undefined)}
            onAccept={() => {
                setDialog(null)
                onRemove(attribute)
                close(true)
            }}
        />)
    }

    // --- Auxiliary function --- //

    const handleSelect = (attribute) => {
        onSelect()
        if (attributeSelected?.name() == attribute?.name())
            setAttributeSelected(undefined)
        else setAttributeSelected(new Attribute(attribute))
    }

    const close = (deselect = false) => {
        if (deselect == true)
            setAttributeSelected(undefined)
    }

    // --- React Component --- //

    return <div className={styles.attributes}>
        { attributes?.toArray().map((attribute, key) => !attribute ? <></> :
            <article key={key}>
                
                <div className={styles.attribute} onClick={() => handleSelect(attribute)}>
                    <p 
                        className={`${attribute?.isActive() ? styles.active : styles.inactive}`}
                        >{attribute.name()}
                    </p>
                    <img 
                        className={styles.img} 
                        src={removeIcon}
                        onClick={e => handleRemove(attribute, e)}
                    />
                </div>

                { attributeSelected?.name() == attribute?.name() &&
                    <div className={styles.details}>
                        {attributeSelected.values().map((value, key) => 
                            <p 
                                key={key}
                                className={`${styles.value} ${value.disabled ? styles.disabled : ''}`}
                                >{value.name}
                            </p>
                        )}
                    </div>
                }

            </article>
        )}

        {dialog}

    </div>
}