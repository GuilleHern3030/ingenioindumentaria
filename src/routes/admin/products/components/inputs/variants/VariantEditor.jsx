import { useRef, useState, useEffect } from 'react'

import styles from './VariantEditor.module.css'
import Input from '../../../../components/input/Input'

import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'
import removeIcon from '@/assets/icons/delete.webp'
import restoreIcon from '@/assets/icons/restore.webp'

import Images from '../images/Images'

import { ProductVariant } from '@/api/objects/ProductVariant'
import { AttributeValue } from '@/api/objects/AttributeValue'

export default ({attributes, product, variant, onSubmit, onDelete, onEnable, onCancel, t}) => {

    // Images
    const [ images, setImages ] = useState([])
    const [ prevImages, setPrevImages ] = useState([])

    // Values
    const [ values, setValues ] = useState([])

    useEffect(() => {
        if (!variant) return;
        if (attributes?.length > 0) {
            setValues(defaultValues())
            setPrevImages(variant?.images())
        } else setValues([])
    }, [attributes, product, variant])

    const price = useRef()
    const inStock = useRef()
    const description = useRef()

    const defaultValues = () => {
        console.log("VariantEditor variant:", variant)
        return (!variant) ? attributes.map(attr => null)
            : variant.values(attributes)
    }

    const getVariantData = () => {

        const Attributes = []
        values.forEach((attributeValue, index) => {
            Attributes.push({
                attributeId:attributes[index].id,
                attributeName:attributes[index].name,
                valueId:attributeValue?.id() ?? attributeValue,
                valueName:attributeValue?.name() ?? undefined
            })
        })

        return {
            id: variant?.id(),
            description: description?.current?.value?.length > 0 ? description.current.value : undefined,
            price: Number(price?.current?.value) > 0 ? Number(price?.current?.value) : undefined,
            inStock: Number(inStock?.current?.value) > 0 ? Number(inStock?.current?.value) : undefined,
            discount: Number(inStock?.current?.value) > 0 ? Number(inStock?.current?.value) : undefined,
            disabled: !(variant?.isActive() ?? true),
            Images: images.filter(img => !(img?.removed && img?.file)),
            Attributes,
        }
    }

    const handleSubmit = () => {
        const variantData = getVariantData()
        console.log("VariantEditor Values:", values)
        console.log("VariantEditor Data:", variantData)
        try {
            const variant = new ProductVariant(variantData)
            if (variant.hasAnyValue())
                onSubmit(variant)
            else onCancel()
            return;
        } catch(e) { } 
        onCancel()
    }

    const setValue = (index, value) => {
        values[index] = value
        setValues(values.slice())
    }

    return <div className={styles.editor}>

        <article>
            <Input ref={description} name='description' className={styles.input} label={`${t("description")}`} defaultValue={variant?.description()}/>
            <Input ref={price} name='price' className={styles.input} label={`${t("price")}`} extension='$' type='number' min={0} defaultValue={variant?.price()}/>
            <Input ref={inStock} name='stock' className={styles.input} label={`${t("in_stock")}`} extension={t('units')} type='number' min={0} defaultValue={variant?.inStock()} />
            { attributes && values && attributes.length > 0 && attributes.toArray().map((attribute, i) => <Characteristics attribute={attribute} value={values[i]} setValue={value => setValue(i, value)} key={i} t={t}/>) 
                }
        </article>

        <Images defaultImages={prevImages} onChange={setImages} t={t}/>

        <div className='flex-center'>
            <img onClick={handleSubmit} className={styles.button} src={acceptIcon}/>
            { variant && <img onClick={() => onDelete(variant)} className={styles.button} src={removeIcon}/> }
            { variant && variant.isActive() === false && <img onClick={() => onEnable(variant)} className={styles.button} src={restoreIcon}/> }
            <img onClick={onCancel} className={styles.button} src={cancelIcon}/>
        </div>

    </div>

}

const Characteristics = ({attribute, setValue, value, t}) => {

    const hasValues = attribute?.values()?.length > 0 && Array.isArray(attribute.values())

    const [ values, setValues ] = useState()

    useEffect(() => {
        if (hasValues) {

            const children = value == null ? attribute.values().toArray().map((value, key) => 
                <p 
                    key={key}
                    className={`${styles.value}`}
                    onClick={() => setValue(value)}
                    >{value.name()}
                </p>
            ) : <p 
                onClick={() => setValue(null)}
                className={`${styles.value} ${styles.selected}`}
                >{value.name()}
            </p>

            setValues(<div className={styles.values}>{children}</div>)

        } else setValues([])

    }, [attribute, value])

    return <div className={styles.characteristics}>
        <p className={styles.characteristic}>{attribute.name()}:</p>
        { hasValues == true ? 
            values 
            : 
            <p className={styles.no_values}>{t('attribute_no_values')}</p>

        }
    </div> 
}