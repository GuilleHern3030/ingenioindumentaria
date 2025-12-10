import { useEffect, useRef, useState } from 'react'
import styles from './Editor.module.css'

import closeIcon from '@/assets/icons/cancel.webp'
import deleteIcon from '@/assets/icons/delete.webp'
import saveIcon from '@/assets/icons/accept.webp'

import Input from '../../../components/input/Input'
import Categories from '../../../components/categories/Categories.tsx'

import Loading from '@/components/loading/FullLoading'
import Dialog from '@/components/dialog/Dialog'
import Attributes from '../inputs/attributes/Attributes'
import Images from '../inputs/images/Images'
import Alert from '@/components/alert/Alert'
import { devMode } from '@/api'
import Variants from '../inputs/variants/Variants'

export default ({product, onSuccess, onCancel, onDelete, defaultCategory=undefined, defaultAttributes=[], defaultVariants=[], t}) => {

    // Dialog
    const [ dialogShowed, setDialogShowed ] = useState()

    // Request
    const [ isLoading, setIsLoading ] = useState(false)
    const [ warning, setWarning ] = useState()

    // Categories
    const [ categories, setCategories ] = useState(defaultCategory)
    const [ prevCategories, setPrevCategories ] = useState(defaultCategory)

    // Attributes
    const [ attributes, setAttributes ] = useState(defaultAttributes)
    const [ prevAttributes, setPrevAttributes ] = useState(defaultAttributes)

    // Variants
    const [ variants, setVariants ] = useState(defaultVariants)
    const [ prevVariants, setPrevVariants ] = useState(defaultVariants)

    // Images
    const [ images, setImages ] = useState([])
    const [ prevImages, setPrevImages ] = useState([])

    useEffect(() => { 
        console.log("%cPRODUCT LOADED", "color:blue; background:pink; padding:4px; border:1px solid blue;", product?.toJson())
        if (product !== null) {
            setPrevCategories(product?.categories())
            setPrevAttributes(product?.attributes())
            setPrevImages(product?.images())
            setPrevVariants(product?.variants())
        } else {
            if (defaultCategory) 
                setPrevCategories([{slug:defaultCategory}])
            //if (defaultAttributes) setPrevAttributes()
        }
    }, [product])

    const name = useRef()
    const description = useRef()
    const price = useRef()
    const inStock = useRef()
    const isRecent = useRef()
    const isActive = useRef()

    const showDialog = (title, message, funcOnAccept) => {
        setDialogShowed(<Dialog
            title={title}
            message={message}
            onAccept={() => { setDialogShowed(null); funcOnAccept() }}
            onReject={() => setDialogShowed(null)}
        />)
    }

    const getProductData = () => {
        return {
            product: {
                id: product?.id(),
                name: name.current.value.trim(),
                description: description.current.value.trim(),
                price: Number(price.current.value),
                inStock: Number(inStock.current.value),
                isRecent: isRecent.current.checked,
                disabled: !(isActive.current ? isActive.current.checked : true),
            },
            slugs: categories,
            images: images.filter(img => !(img?.removed && img?.file)),
            attributes,
            variants: variants ? variants.map(variant => variant.toJson()) : []
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
        const productData = getProductData()
        console.log("Data to save:", productData)
        if (productData.product.name.length > 0 || devMode()) {
            if (productData.product.price > 0 || devMode()) {
                showDialog(
                    t('editor_save_title'), 
                    t('editor_save_message'),
                    () => onSuccess(productData)
                )
            } else setWarning(t('editor_invalid_price'))
        } else setWarning(t('editor_invalid_name'))
    }

    const handleDelete = () => {
        showDialog(
            t('editor_remove_title'), 
            product?.isActive() ? 
                t('editor_disable_message') : 
                t('editor_delete_message'), 
            () => onDelete(product)
        )
    }

    return <section>

        { warning && <p className='error'>{warning}</p>}
        
        <Categories defaultCategories={prevCategories} onChange={setCategories} t={t}/>

        <Input ref={name} name='name' className={styles.input} label={t("name")} defaultValue={product?.name()}/>
        <Input ref={description} name='description' className={styles.input} label={`${t("description")} ${t("default")}`} defaultValue={product?.description()}/>
        <Input ref={price} name='price' className={styles.input} label={`${t("price")} ${t("default")}`} extension='$' type='number' min={0} defaultValue={product?.price()}/>
        <Input ref={inStock} name='stock' className={styles.input} label={`${t("in_stock")} ${t("default")}`} extension={t('units')} type='number' min={0} defaultValue={product === null ? 1 : product?.inStock()}/>

        <Input ref={isRecent} className={styles.input} label={`${t('is_new')}:`} type='checkbox' defaultChecked={product === null ? true : product?.isRecent()}/>
        { !(product?.isActive() || !product) && <Input ref={isActive} className={styles.input} label={`${t('is_available')}:`} type='checkbox' defaultChecked={product?.isActive()}/> }

        <Images defaultImages={prevImages} onChange={setImages} t={t}/>

        <Attributes defaultAttributes={prevAttributes} defaultCategories={prevCategories} onChange={setAttributes} t={t}/>
        { attributes && <Variants product={product} attributes={attributes} defaultVariants={prevVariants} onChange={setVariants} t={t}/> }

        <div className={styles.footer}>
            <div className={styles.icon}> <img src={closeIcon} onClick={handleCancel}/> </div>  
            <div className={styles.icon}> { product && <img src={deleteIcon} onClick={handleDelete}/> } </div>  
            <div className={styles.icon}> <img src={saveIcon} onClick={handleSave}/> </div>  
        </div>

        { warning && <Alert
            onAccept={() => setWarning(undefined)}
            title={t('error')}
            > <p className='error'>{warning}</p> </Alert>
        }

        {dialogShowed}

    </section>

}