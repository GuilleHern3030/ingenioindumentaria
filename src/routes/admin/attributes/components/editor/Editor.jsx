import { useEffect, useRef, useState } from 'react'
import styles from './Editor.module.css'

import closeIcon from '@/assets/icons/cancel.webp'
import deleteIcon from '@/assets/icons/delete.webp'
import saveIcon from '@/assets/icons/accept.webp'
import enableIcon from '@/assets/icons/restore.webp'

import Input from '../../../components/input/Input'
import Categories from '../categories/Categories'

import Loading from '@/components/loading/FullLoading'
import Values from '../values/Values'
import Dialog from '@/components/dialog/Dialog'
import Alert from '@/components/alert/Alert'
import { devMode } from '@/api'

import Attribute from '../../utils/Attribute'

export default ({ attributeSelected, categories, onSuccess, onCancel, onEnable, onDelete, t }) => {

    const [ dialogShowed, setDialogShowed ] = useState()
    const [ error, setError ] = useState()
    const [ attribute, setAttribute ] = useState()

    useEffect(() => { 
        console.log("Attribute Selected", attributeSelected)
        console.log("Categories", categories)
        setAttribute(new Attribute(attributeSelected))
    }, [ attributeSelected ])

    const name = useRef()
    const isActive = useRef()

    const showDialog = (title, message, funcOnAccept) => {
        setDialogShowed(<Dialog
            title={title}
            message={message}
            onAccept={() => { setDialogShowed(null); funcOnAccept() }}
            onReject={() => setDialogShowed(null)}
        />)
    }

    const handleSave = () => {
        if (name.current.value.trim().length > 0) {
            const attributeData = attribute.toJson()
            attributeData.name = name.current.value
            console.log(attributeData)
            showDialog(
                t('editor_save_title'), 
                t('editor_save_message'),
                () => onSuccess(attributeData, name.current.value)
            )
        } else setError(t('editor_invalid_name'))
    }

    const handleCancel = () => {
        showDialog(
            t('editor_cancel_title'), 
            t('editor_cancel_message'),
            onCancel
        )
    }

    const handleDelete = () => {
        showDialog(
            t('editor_remove_title'), 
            attribute?.disabled === false ? 
                t('editor_disable_message') : 
                t('editor_delete_message'), 
            () => onDelete(attribute)
        )
    }

    const handleEnable = () => {
        showDialog(
            t('editor_recove_title'),  
            attribute.name, 
            () => onEnable(attribute)
        )
    }

    // --- VALUES EDITOR --- //

    const handleAddValue = (value) => {
        console.log("attribute:", attribute)
        console.log("value:", value)
        if (value?.length > 0) {
            if (!attribute.hasValue(value)) {
                setAttribute(attribute.addValue(value))
            } else setError(t('attribute_value_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleEditValue = (prevValue, newValue) => {
        if (newValue?.length > 0) {
            if (!attribute.hasValue(newValue)) {
                setAttribute(attribute.renameValue(prevValue, newValue))
            } else setError(t('attribute_value_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleDisableValue = (value) => 
        setAttribute(prev => prev.disableValue(value))

    const handleEnableValue = (value) => 
        setAttribute(attribute.enableValue(value))

    const handleRemoveValue = (value) => 
        setAttribute(prev => prev.removeValue(value))

    // --- CATEGORIES EDITOR --- //

    const handleAddCategory = (slug) => 
        setAttribute(prev => prev.addCategory(slug))

    const handleRemoveCategory = (slug) => 
        setAttribute(prev => prev.removeCategory(slug))

    // --- React Component --- //

    return <section>

        { error && <p className='error'>{error}</p>}
        
        <Categories
            categories={categories}
            slugs={attribute?.slugs}
            onAdd={handleAddCategory} 
            onRemove={handleRemoveCategory} 
            t={t}
        />

        { attribute?.disabled === true && <p className={styles.disabled}>{t('attribute_disabled')}</p> }

        <Input ref={name} name='name' className={styles.input} label={t("name")} defaultValue={attribute?.name}/>

        { attribute && 
            <Values 
                values={attribute.values} t={t}
                onAddValue = {handleAddValue} 
                onEditValue = {handleEditValue} 
                onRemoveValue = {handleRemoveValue}
                onDisableValue = {handleDisableValue}
                onEnableValue = {handleEnableValue}
            />
        }

        { !(!attribute?.disabled || !attribute) && <Input ref={isActive} className={styles.input} label={`${t('is_available')}:`} type='checkbox' defaultChecked={!attribute?.disabled}/> }

        <div className={styles.footer}>
            <div className={styles.icon}> <img src={closeIcon} onClick={handleCancel}/> </div>  
            { attribute?.id && <div className={styles.icon}> <img src={deleteIcon} onClick={handleDelete}/> </div> }
            { !attribute?.disabled === false && <div className={styles.icon}> <img src={enableIcon} onClick={handleEnable}/> </div> } 
            <div className={styles.icon}> <img src={saveIcon} onClick={handleSave}/> </div>  
        </div>

        { error && <Alert
            onAccept={() => setError(undefined)}
            title={t('error')}
            > <p className='error'>{error}</p> </Alert>
        }

        {dialogShowed}

    </section>

}