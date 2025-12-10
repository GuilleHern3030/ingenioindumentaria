import { useEffect, useState, useRef } from 'react'
import { useOutletContext } from "react-router-dom";
import useParams from '@/hooks/useParams';

import addIcon from '@/assets/icons/add.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'
import removeIcon from '@/assets/icons/delete.webp'
import crossIcon from '@/assets/icons/cross.webp'
import restoreIcon from '@/assets/icons/restore.webp'

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
        onCreate, 
        onDisable, 
        onRemove, 
        onEnable, 
        onEdit,
        onAddValue, 
        onEditValue, 
        onRemoveValue,
        onDisableValue,
        onEnableValue,
    t}) => {

    const [ attributeSelected, setAttributeSelected ] = useState()
    const [ isRenaming, setIsRenaming ] = useState(null)
    const [ isEditing, setIsEditing ] = useState(null)
    const [ isAdding, setIsAdding ] = useState(false)
    const [ isCreating, setIsCreating ] = useState(false)
    const [ dialog, setDialog ] = useState(null)
    const nameRef = useRef()

    useEffect(() => { close() }, [attributeSelected])

    // --- Attributes editor --- //

    const handleCreate = (name) => {
        if (name.trim().length > 0 && !StringUtils.hasSpecialCharacter(name))
            onCreate(name)
        close()
    }

    const handleEdit = (attribute, name) => {
        if (name.trim().length > 0 && attribute.name != name && !StringUtils.hasSpecialCharacter(name))
            onEdit(attribute, name)
        close(true)
    }

    const handleRemove = (attribute) => {
        setDialog(<Dialog
            title={t('attribute_remove_title')}
            message={attribute.disabled !== true ? t('attribute_disable_message') : t('attribute_remove_message')}
            onReject={() => setDialog(undefined)}
            onAccept={() => {
                setDialog(null)
                if (attribute.isActive()) onDisable(attribute)
                else onRemove(attribute)
                close(true)
            }}
        />)
    }

    const handleEnable = (attribute) => {
        setDialog(<Dialog
            title={t('attribute_enable_title')}
            message={t('attribute_enable_message')}
            onReject={() => setDialog(undefined)}
            onAccept={() => {
                setDialog(null)
                onEnable(attribute)
                close(true)
            }}
        />)
    }

    // --- Attribute values editor --- //

    const handleAddValue = (attribute, value) => {
        if (attribute && value?.length > 0 && !StringUtils.hasSpecialCharacter(value))
            onAddValue(attribute, value)
        close()
    }

    const handleEditValue = (attribute, prevValue, newValueName) => {
        if (attribute && prevValue && newValueName?.length > 0 && prevValue.name() != newValueName && !StringUtils.hasSpecialCharacter(newValueName))
            onEditValue(attribute, prevValue, newValueName)
        close()
    }

    const handleRemoveValue = (attribute, value) => {
        const valueIsActive = attribute.getValue(value).isActive()
        setDialog(<Dialog
            title={t('attribute_value_remove_title')}
            message={valueIsActive ? t('attribute_disable_message') : t('attribute_remove_message')}
            onReject={() => setDialog(undefined)}
            onAccept={() => {
                setDialog(null)
                if (valueIsActive) onDisableValue(attribute, value)
                else onRemoveValue(attribute, value)
                close()
            }}
        />)
    }

    const handleEnableValue = (attribute, value) => {
        setDialog(<Dialog
            title={t('attribute_value_enable_title')}
            message={value.name()}
            onReject={() => setDialog(null)}
            onAccept={() => {
                setDialog(null)
                onEnableValue(attribute, value)
                close()
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
        setIsCreating(false) 
        setIsAdding(false)
        setIsRenaming(null)
        setIsEditing(null)
        if (deselect == true)
            setAttributeSelected(undefined)
    }

    // --- React Component --- //

    return <div className={styles.attributes}>
        {
            attributes?.toArray().map((attribute, key) => !attribute ? <></> :
                <article key={key}>
                    { attributeSelected?.name() != attribute?.name() ?
                    
                        <p 
                            className={attribute?.isActive() ? `button_square_white` : styles.inactive}
                            style={{margin:'.8em'}}
                            onClick={() => handleSelect(attribute)}
                            >{attribute.name()}
                        </p>

                    :
                        <div className={styles.details}>
                            { !isRenaming ?
                                <div className={styles.details_header}>
                                    <div></div>
                                    <p 
                                        onClick={() => setIsRenaming(attribute)}
                                        className={styles.attribute_detailed}
                                        >{attribute?.name()}
                                    </p> 
                                    <div className={styles.cross}>
                                        { !isRenaming && 
                                            <>
                                                <img src={cancelIcon} onClick={() => handleSelect(attribute)}/>
                                                <img src={removeIcon} onClick={() => handleRemove(attribute)}/>
                                                { !attributeSelected?.isActive() && <img src={restoreIcon} onClick={() => handleEnable(attribute)}/> }
                                            </>
                                        }
                                    </div>
                                </div>
                                :
                                <div className={styles.form}>
                                    <p>{t('name')}:</p>
                                    <Input ref={nameRef} name='value' className={styles.input} defaultValue={attribute.name()}/>
                                    <img onClick={() => handleEdit(attribute, nameRef.current.value.trim())} src={acceptIcon}/>
                                    <img onClick={() => setIsRenaming(null)} src={cancelIcon}/>
                                </div>
                            }
                            <hr style={{width:'100%'}}/>
                            { attribute.values(false)?.length > 0 && attribute.values(false).toArray().map((value, key) => <div key={key}>
                                { !isEditing || isEditing.name() != value.name() ? 
                                    <p 
                                        className={(value.isActive()) ? styles.value : styles.value_disabled}
                                        onClick={() => setIsEditing(value)}
                                        >{value.name()}</p> 
                                    :
                                    <div className={styles.form}>
                                        <p>{t('value')}:</p>
                                        <Input ref={nameRef} name='value' className={styles.input} defaultValue={value}/>
                                        <img onClick={() => handleEditValue(attribute, value, nameRef.current.value.trim())} src={acceptIcon}/>
                                        <img onClick={() => setIsEditing(false)} src={cancelIcon}/>
                                        <img onClick={() => handleRemoveValue(attribute, value)} src={removeIcon}/>
                                        { !value.isActive() && <img onClick={() => handleEnableValue(attribute, value)} src={restoreIcon}/> }
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
                                    <img onClick={() => handleAddValue(attribute, nameRef.current.value.trim())} src={acceptIcon}/>
                                    <img onClick={() => setIsAdding(false)} src={cancelIcon}/>
                                </div>
                            }
                        </div>
                    }
                </article>
            )
        }
        { attributeSelected || isAdding || isEditing ? <></> :
            !isCreating ? 
            <img 
                onClick={() => setIsCreating(true)}
                className={`cursor ${styles.add}`} 
                src={addIcon}
            /> 
            :
            <div className={`${styles.form} ${styles.form_create}`}>
                <p>{t('name')}</p>
                <Input ref={nameRef} name='attribute' className={styles.input}/>
                <div>
                    <img onClick={() => handleCreate(nameRef.current.value.trim())} src={acceptIcon}/>
                    <img onClick={() => setIsCreating(false)} src={cancelIcon}/>
                </div>
            </div>
        }
        {dialog}
    </div>
}