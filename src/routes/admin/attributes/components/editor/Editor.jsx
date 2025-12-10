import { useEffect, useRef, useState } from 'react'
import styles from './Editor.module.css'

import closeIcon from '@/assets/icons/cancel.webp'
import deleteIcon from '@/assets/icons/delete.webp'
import saveIcon from '@/assets/icons/accept.webp'
import enableIcon from '@/assets/icons/restore.webp'

import Input from '../../../components/input/Input'
import Categories from '../../../components/categories/Categories.tsx'

import Loading from '@/components/loading/FullLoading'
import Values from '../values/Values'
import Dialog from '@/components/dialog/Dialog'
import Alert from '@/components/alert/Alert'
import { devMode } from '@/api'

export default ({attribute, onSuccess, onCancel, onEnable, onDelete, defaultCategory=undefined, t}) => {

    // Dialog
    const [ dialogShowed, setDialogShowed ] = useState()

    // Request
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState()

    // Categories
    const [ categories, setCategories ] = useState(defaultCategory)
    const [ prevCategories, setPrevCategories ] = useState(defaultCategory)

    const [ attributeSelected, setAttribute ] = useState(attribute)

    useEffect(() => { 
        console.log(attribute)
        if (attribute.categories().length > 0) 
            setPrevCategories(attribute?.categories())
        else if (defaultCategory) 
            setPrevCategories([{slug:defaultCategory}])
    }, [attribute])

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

    const getAttributeData = () => {
        return {
            attribute: {
                id: attribute?.id(),
                name: name.current.value.trim(),
                disabled: !(isActive.current ? isActive.current.checked : true),
                values: attributeSelected?.rawValues() ?? [],
            },
            slugs: categories
        }
    }

    const handleCancel = () => {
        showDialog(
            t('editor_cancel_title'), 
            t('editor_cancel_message'),
            onCancel
        )
    }

    const handleSave = () => {
        const attributeData = getAttributeData()
        console.log(attributeData)
        if (attributeData.attribute.name.trim().length > 0) {
            showDialog(
                t('editor_save_title'), 
                t('editor_save_message'),
                () => onSuccess(attributeData)
            )
        } else setError(t('editor_invalid_name'))
    }

    const handleDelete = () => {
        showDialog(
            t('editor_remove_title'), 
            attribute?.isActive() ? 
                t('editor_disable_message') : 
                t('editor_delete_message'), 
            () => onDelete(attribute)
        )
    }

    const handleEnable = () => {
        showDialog(
            t('editor_recove_title'),  
            attribute.name(), 
            () => onEnable(attribute)
        )
    }

    // --- VALUES EDITOR --- //

    const handleAddValue = (attribute, value) => {
        console.log("attribute:", attribute)
        if (value?.length > 0) {
            if (!attribute.hasValue(value)) {
                setAttribute(attribute.addValue(value))
            } else setError(t('attribute_value_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleEditValue = (attribute, prevValue, newValue) => {
        if (newValue?.length > 0) {
            if (!attribute.hasValue(newValue)) {
                setAttribute(attribute.renameValue(prevValue, newValue))
            } else setError(t('attribute_value_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleDisableValue = (attribute, value) => 
        setAttribute(prev => prev.disableValue(value))

    const handleEnableValue = (attribute, value) => 
        setAttribute(attribute.enableValue(value))

    const handleRemoveValue = (attribute, value) => 
        setAttribute(prev => prev.removeValue(value))

    // --- React Component --- //

    return <section>

        { error && <p className='error'>{error}</p>}
        
        <Categories defaultCategories={prevCategories} onChange={setCategories} t={t}/>

        <Input ref={name} name='name' className={styles.input} label={t("name")} defaultValue={attribute?.name()}/>

        <Values attribute={attributeSelected} t={t}
            onAddValue = {handleAddValue} 
            onEditValue = {handleEditValue} 
            onRemoveValue = {handleRemoveValue}
            onDisableValue = {handleDisableValue}
            onEnableValue = {handleEnableValue}
        />

        { !(attribute?.isActive() || !attribute) && <Input ref={isActive} className={styles.input} label={`${t('is_available')}:`} type='checkbox' defaultChecked={attribute?.isActive()}/> }

        <div className={styles.footer}>
            <div className={styles.icon}> <img src={closeIcon} onClick={handleCancel}/> </div>  
            { attribute.id() && <div className={styles.icon}> <img src={deleteIcon} onClick={handleDelete}/> </div> }
            { attribute.isActive() === false && <div className={styles.icon}> <img src={enableIcon} onClick={handleEnable}/> </div> } 
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