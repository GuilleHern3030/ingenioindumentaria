import { useEffect, useState, useRef } from 'react'
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";

import styles from './Attributes.module.css'

import Loading from '@/components/loading/Loading'
import Dialog from '@/components/dialog/Dialog'
import Alert from '@/components/alert/Alert'
import Reload from '../../components/reload/Reload'
import AttributesPreview from './components/preview/AttributesPreview'
import AttributesList from './components/list/AttributesList'

import { put as applyCategoryAttributes } from '@/api/categories'
import { request } from '@/api'

import CategoryUtils from '../utils/CategoryUtils';

import Attributes from './Attributes'

import category from '@/api/models/Category';
import attribute from '@/api/models/Attribute';
import Input from '../../components/input/Input';

export default () => {

    const navigate = useNavigate()
    const location = useLocation()

    const checkRef = useRef()

    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [asked, setAsked] = useState(false)
    const [error, setError] = useState(null)
    const [networkError, setNetworkError] = useState(false)
    const [dialog, setDialog] = useState(null)
    const [category, setCategory] = useState<category>()
    const [attributes, setAttributes] = useState<Attributes>()
    const [allAttributes, setAllAttributes] = useState<attribute[]>()

    const { t } = useOutletContext<any>()

    useEffect(() => {
        if (location.state && location.state.categories && location.state.slug) {
            const categories = location.state.categories
            const allAttributes = categories.attributes
            const slug = location.state.slug
            const category = CategoryUtils.find(categories, slug)
            const attributes = Object.assign(new Attributes(), category.attributes)
            setCategory(category)
            setAttributes(attributes)
            setAllAttributes(allAttributes)
            setIsLoading(false)
        } else navigate("/admin/categories", { replace: true })
    }, [])

    // --- Attributes editor --- //

    const handleAdd = (attribute: attribute) => {
        setIsAdding(false)
        if (attribute) {
            if (!attributes?.has(attribute)) {
                setAttributes(attributes.add(attribute))
            } else setError(t('attribute_no_repeated'))
        } else setError(t('attribute_no_name_error'))
    }

    const handleRemove = (attribute: attribute) => {
        setAttributes(attributes.remove(attribute))
        setAsked(true)
    }

    // --- Save changes --- //

    const handleSave = () => {
        setDialog(<Dialog
            title={t('save_edition_title')}
            message={undefined}
            onReject={() => setDialog(null)}
            onAccept={() => {
                if (category) {
                    const applyToChildren = checkRef?.current?.checked ?? false
                    setDialog(null)
                    category.attributes = attributes.toArray();
                    console.log("Saving:", category) // { slug, disabled, children, attributes }
                    request(setIsLoading, setError, applyCategoryAttributes, category, applyToChildren)
                    .then(result => {
                        console.log(allAttributes)
                        setDialog(<Alert
                            title={t('saved')}
                            onAccept={() => navigate("/admin/categories")}
                            message={undefined}> 
                                <Saved 
                                    attributes={allAttributes} 
                                    putted={result} 
                                    appliedToChildren={applyToChildren}
                                    t={t}/> 
                            </Alert>
                        );
                    })
                    .catch(e => {
                        console.error(e);
                        if (e?.status() === 503)
                            setNetworkError(true);
                    });
                }
            }} >
                <Input
                    ref={checkRef}
                    className={styles.dialog}
                    label={t('save_edition_message')}
                    defaultChecked={false}
                    type="checkbox"
                />
            </Dialog>)
    }

    const handleCancel = () => {
        setDialog(<Dialog
            title={t('cancel_edition_title')}
            message={t('cancel_edition_message')}
            onReject={() => setDialog(null)}
            onAccept={() => navigate("/admin/categories")}
            children={undefined}
        />)
    }

    // --- Auxiliary function --- //

    const handleSelect = () => {
        setError(null)
    }

    // --- React Component ---

    return category ? <>
        <section className={styles.header}>
            <p className={styles.title}>{category ? t('attributes') : t('attributes_global')}</p>
            <p className={styles.slug}>{category.slug.replaceAll("-", " ")}</p>
        </section>
        {error && <p className='error'>{error}</p>}
        <section className={styles.instructions}>
            <p className={styles.instruction}>{t('attributes_instruction_1')}</p>
            <p className={styles.instruction}>{t('attributes_instruction_2')}</p>
            <p className={styles.instruction}>{t('attributes_instruction_3')}</p>
            <p className={styles.instruction}>{t('attributes_instruction_4')}</p>
        </section>
        <hr />
        {isLoading == true ? <Loading style={undefined} color={undefined} backgroundColor={undefined} className={undefined} /> :
            !networkError ?
                <>
                    {!isAdding ?
                        <AttributesPreview
                            attributes={attributes}
                            onSelect={handleSelect}
                            onRemove={handleRemove}
                            asked={asked}
                            t={t}
                        />
                        :
                        <AttributesList
                            prevAttributes={attributes}
                            allAttributes={allAttributes}
                            onAdd={handleAdd}
                            t={t}
                        />
                    }

                    <hr />

                    <div className='flex-center-column'>
                        {!isAdding ?
                            <button className={styles.add} onClick={() => setIsAdding(true)}>{t('add')}</button> :
                            <button className={styles.add} onClick={() => setIsAdding(false)}>{t('close')}</button>
                        }
                        <button className={styles.save} onClick={handleSave}>{t('save')}</button>
                        <button className={styles.cancel} onClick={handleCancel}>{t('cancel')}</button>
                    </div>

                </> : <Reload />
        } {dialog}
    </> : <Loading/>
}

const Saved = ({attributes, putted, appliedToChildren, t}) => {

    const names = (ids:number[]) => 
        ids?.length > 0 ?
            <span className={styles.something}> {
                attributes
                .filter((attribute:attribute) => ids.includes(attribute.id))
                .map((attribute:attribute) => attribute.name)
                .join(" - ")
            }</span>
        : <span className={styles.nothing}>{t('nothing')}</span>

    return <div className={styles.response}>
        <p>{`${t('added')}:`} {names(putted.added)}</p>
        <p>{`${t('unedited')}:`} {names(putted.unedited)}</p>
        <p>{`${t('removed')}:`} {names(putted.removed)}</p>
        { appliedToChildren && <p>{t('applied-to-children')}</p>}
    </div>

}