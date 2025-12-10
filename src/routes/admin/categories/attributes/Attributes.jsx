import { useEffect, useState, useRef } from 'react'
import { useOutletContext, useNavigate } from "react-router-dom";
import useParams from '@/hooks/useParams';
import addIcon from '@/assets/icons/add.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'
import removeIcon from '@/assets/icons/remove.webp'

import styles from './Attributes.module.css'

import { selectAll, put as applyCategoryAttributes } from '@/api/categories.ts'
import { globalPut as applyGlobalAttributes } from '@/api/attributes.ts'
import { request } from '@/api'

import Loading from '@/components/loading/Loading.jsx'
import Reload from '../../components/reload/Reload.jsx'
import Input from '../../components/input/Input';
import Attributes from './components/attributes/Attributes';
import Dialog from '@/components/dialog/Dialog';
import Alert from '@/components/alert/Alert';

export default () => {

    const params = useParams()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    const [networkError, setNetworkError] = useState(false)
    const [dialog, setDialog] = useState()
    const [categories, setCategories] = useState()
    const [category, setCategory] = useState()
    const [attributes, setAttributes] = useState([])

    const { t } = useOutletContext()

    useEffect(() => {
        request(setIsLoading, setError, selectAll, true)
        .then(categories => {
            const category = categories.get(params?.category)
            const attributes = category?.attributes()
            setCategories(categories)
            setCategory(category)
            setAttributes(attributes)
        })
        .catch(e => {
            console.error(e)
            if (e?.isNetworkError())
                setNetworkError(true)
        })
    }, [])

    useEffect(() => {
        console.log("actualizedAttributes:", attributes)
    }, [attributes])

    // --- Attributes editor --- //

    const handleCreate = (name) => {
        if (name.length > 0) {
            if (!attributes?.has(name)) {
                setAttributes(attributes.add(name))
            } else setError(t('attribute_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleEdit = (attribute, name) => {
        if (name.length > 0) {
            if (!attributes?.has(name)) {
                setAttributes(attributes.rename(attribute, name))
            } else setError(t('attribute_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleDisable = (attribute) => 
        setAttributes(attributes.disable(attribute))

    const handleEnable = (attribute) => 
        setAttributes(attributes.enable(attribute))

    const handleRemove = (attribute) => 
        setAttributes(attributes.remove(attribute))


    // --- Attribute values editor --- //

    const handleAddValue = (attribute, value) => {
        if (value?.length > 0) {
            if (!attributes.hasValue(attribute, value)) {
                setAttributes(attributes.addValue(attribute, value))
            } else setError(t('attribute_value_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleEditValue = (attribute, prevValue, newValue) => {
        if (newValue?.length > 0) {
            if (!attributes.hasValue(attribute, newValue, false)) {
                attributes.renameValue(attribute, prevValue, newValue)
                setAttributes(attributes.slice())
            } else setError(t('attribute_value_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleRemoveValue = (attribute, value) => 
        setAttributes(attributes.removeValue(attribute, value))

    const handleDisableValue = (attribute, value) => 
        setAttributes(attributes.disableValue(attribute, value))

    const handleEnableValue = (attribute, value) => 
        setAttributes(attributes.enableValue(attribute, value))

    // --- Save changes --- //

    const handleSave = () => {
        setDialog(<Dialog
            title={t('save_edition_title')}
            message={t('save_edition_message')}
            onReject={() => setDialog(null)}
            onAccept={() => {
                category.setAttributes(attributes)
                const save = category ? applyCategoryAttributes : applyGlobalAttributes
                request(setIsLoading, setError, save, category)
                .then(result => {
                    console.log("result:", result)
                    setDialog(<Alert
                        title={t('saved')}
                        onAccept={() => navigate("/admin/categories")}
                    />)
                })
                .catch(e => {
                    console.error(e)
                    if (e?.status() === 503)
                        setNetworkError(true)
                })
            }}
        />)
    }

    const handleCancel = () => {
        setDialog(<Dialog
            title={t('cancel_edition_title')}
            message={t('cancel_edition_message')}
            onReject={() => setDialog(null)}
            onAccept={() => navigate("/admin/categories")}
        />)
    }

    // --- Auxiliary function --- //

    const handleSelect = () => {
        setError()
    }

    // --- React Component ---

    return <> 
        <section className={styles.header}>
            <p className={styles.title}>{params?.category ? t('attributes') : t('attributes_global')}</p>
            { category && <p className={styles.slug}>{category.slug()}</p> }
        </section>
        {error && <p className='error'>{error}</p>}
        <section className={styles.instructions}>
            <p className={styles.instruction}>{t('attributes_instruction_1')}</p>
            <p className={styles.instruction}>{t('attributes_instruction_2')}</p>
            <p className={styles.instruction}>{t('attributes_instruction_3')}</p>
            <p className={styles.instruction}>{t('attributes_instruction_4')}</p>
        </section>
        <hr/>
        { isLoading == true ? <Loading/> :
          !networkError ? 
            <>
                <Attributes 
                    attributes={attributes} 
                    onSelect={handleSelect}

                    onCreate={handleCreate} 
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                    onDisable={handleDisable}
                    onEnable={handleEnable}

                    onAddValue={handleAddValue}
                    onEditValue={handleEditValue}
                    onRemoveValue={handleRemoveValue}
                    onDisableValue={handleDisableValue}
                    onEnableValue={handleEnableValue}

                    t={t}
                /> 
                <hr/>
                <div className='flex-center-column'>
                    <button className={styles.save} onClick={handleSave}>{t('save')}</button>
                    <button className={styles.cancel} onClick={handleCancel}>{t('cancel')}</button>
                </div>

            </> : <Reload/>
        } {dialog}
    </>
}

