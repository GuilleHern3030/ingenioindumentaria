import { useEffect, useState, useRef } from 'react'
import { useOutletContext } from "react-router-dom";
import useParams from '@/hooks/useParams';
import addIcon from '@/assets/icons/add.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'
import removeIcon from '@/assets/icons/delete.webp'
import crossIcon from '@/assets/icons/cross.webp'
import restoreIcon from '@/assets/icons/restore.webp'

import styles from './Values.module.css'

import Loading from '@/components/loading/Loading.jsx'
import Input from '../../../components/input/Input'
import Dialog from '@/components/dialog/Dialog';

export default ({
        values, 
        onAddValue, 
        onEditValue, 
        onRemoveValue,
        onDisableValue,
        onEnableValue,
        t
        }) => {


    const [ isRenaming, setIsRenaming ] = useState(null)
    const [ isEditing, setIsEditing ] = useState(null)
    const [ isAdding, setIsAdding ] = useState(false)
    const [ isCreating, setIsCreating ] = useState(false)
    const [ dialog, setDialog ] = useState(null)
    const nameRef = useRef()

    useEffect(() => { close() }, [ values ])

    // --- Attribute values editor --- //

    const handleAddValue = (value) => {
        if (value?.length > 0)
            onAddValue(value)
        close()
    }

    const handleEditValue = (prevValue, newValue) => {
        if (prevValue != newValue)
            onEditValue(prevValue, newValue)
        close()
    }

    const handleRemoveValue = (value) => {
        const valueIsActive = value.disabled !== true
        setDialog(<Dialog
            title={t('attribute_value_remove_title')}
            message={valueIsActive ? t('attribute_disable_message') : t('attribute_remove_message')}
            onReject={() => setDialog(undefined)}
            onAccept={() => {
                setDialog(null)
                if (valueIsActive) onDisableValue(value.name)
                else onRemoveValue(value.name)
                close()
            }}
        />)
    }

    const handleEnableValue = (value) => {
        setDialog(<Dialog
            title={t('attribute_value_enable_title')}
            message={value.name}
            onReject={() => setDialog(null)}
            onAccept={() => {
                setDialog(null)
                onEnableValue(value.name)
                close()
            }}
        />)
    }

    // --- Auxiliary function --- //

    const close = (deselect = false) => {
        setIsCreating(false) 
        setIsAdding(false)
        setIsRenaming(null)
        setIsEditing(null)
    }

    // --- React Component --- //

    return <div className={styles.attributes}>
        {
                <article>
                        <div className={styles.details}>
                            { values?.length > 0 && values.map((value, key) => <div key={key}>
                                { isEditing != value ? 
                                    <p className={value.disabled !== true ? styles.value : styles.value_disabled} onClick={() => setIsEditing(value)}>{value.name}</p> :
                                    <div className={styles.form}>
                                        <p>{t('value')}:</p>
                                        <Input ref={nameRef} name='value' className={styles.input} defaultValue={value.name}/>
                                        <img onClick={() => handleEditValue(value.name, nameRef.current.value.trim())} src={acceptIcon}/>
                                        <img onClick={() => setIsEditing(false)} src={cancelIcon}/>
                                        <img onClick={() => handleRemoveValue(value)} src={removeIcon}/>
                                        { value.disabled === true && <img onClick={() => handleEnableValue(value)} src={restoreIcon}/> }
                                    </div>
                                }
                            </div>)}
                            { isEditing ? <></> :
                              isAdding === false ?
                                <img 
                                    className={`cursor ${styles.add}`} 
                                    src={addIcon}
                                    onClick={() => setIsAdding(true)}
                                /> 
                                :
                                <div className={styles.form}>
                                    <p>{t('value')}:</p>
                                    <Input ref={nameRef} name='value' className={styles.input}/>
                                    <img onClick={() => handleAddValue(nameRef.current.value.trim())} src={acceptIcon}/>
                                    <img onClick={() => setIsAdding(false)} src={cancelIcon}/>
                                </div>
                            }
                        </div>
                </article>
            //)
        }
        {dialog}
    </div>
}