import { useState, useRef, useLayoutEffect } from 'react'

import styles from './Variant.module.css'

// Global components
import Loading from '@/components/loading/Loading'

// Local components
import Attributes from './attributes/Attributes'
import Images from './images/Images'
import InputComponent from '../../../../../../components/input/Input'
const Input = InputComponent as React.FC<any>

import { attributevalue } from '@/api/models/Attribute'

// Hooks
import useClientInfo from '@/hooks/useClientInfo'


export default ({ variant, slugs, nameRef, onSave, onDelete, onCancel, t }) => {

    const { coinSymbol, dataLoaded } = useClientInfo()

    const [ images, setImages ] = useState<any[]>(null)
    const [ attributes, setAttributes ] = useState<attributevalue[]>([])

    const [ error, setError ] = useState(null)

    const name = useRef<HTMLInputElement>(null)
    const price = useRef<HTMLInputElement>(null)
    const stock = useRef<HTMLInputElement>(null)
    const description = useRef<HTMLInputElement>(null)
    const isActive = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
        console.log("VARIANT", variant)
        setImages(variant?.images ?? [])
        setAttributes(variant?.attributes ?? [])
    }, [])

    const handleSave = () => {
        setError(null)

        const variantName = name?.current?.value?.length > 0 ? name.current.value : nameRef.current?.value
        console.log("variantName REF", name.current?.value)
        console.log("NAME REF", nameRef.current?.value)
        if (variantName.trim().length > 0) {
            if (Number(price?.current?.value) > 0) {
                onSave({
                    id: variant?.id ?? null,
                    name: variantName.trim(),
                    description: description?.current?.value.trim(),
                    price: Number(price?.current?.value),
                    stock: stock?.current?.value.length > 0 ? Number(stock?.current?.value) : null,
                    disabled: !(isActive.current ? isActive.current.checked : true),
                    images,
                    attributes,
                    createdAt: variant?.createdAt ?? new Date().toISOString()
                })
            } else setError(t('editor_invalid_price'))
        } else setError(t('editor_invalid_name'))
    }

    return !dataLoaded ? <Loading/> : <article className={styles.variant}>
        
        <Input ref={name} name='fullname' className={styles.input} label={t("fullname")} defaultValue={variant?.name ?? nameRef?.current?.value ?? ''}/>
        <Input ref={price} name='price' className={styles.input} label={`${t("price")}`} extension={coinSymbol} type='number' min={0} defaultValue={variant?.price}/>
        <Input ref={stock} name='stock' className={styles.input} label={`${t("in_stock")}`} extension={t('units')} type='number' min={0} defaultValue={variant === null ? 1 : variant?.stock}/>

        { images && 
            <Images 
                images={images}
                onAdd={(img:any) => {
                    images.push(img)
                    setImages(images.slice())
                }}
                onRemove={(img:any) => {
                    setImages(images => {
                        img.removed = true
                        return images.slice()
                    })
                }}
                onRestore={(img:any) => {
                    setImages(images => {
                        img.removed = false
                        return images.slice()
                    })
                }}
                t={t}
            />
        }

        <Attributes
            selectedAttributes={attributes} 
            slugs={slugs}
            onAdd={(attribute:attributevalue) => {
                if (!attributes.find(selectedAttribute => selectedAttribute.attributeId == attribute.attributeId))
                    setAttributes(attributes => {
                        attributes.push(attribute)
                        return attributes.slice()
                    })
                }
            } 
            onRemove={(attribute:attributevalue) => {
                const index = attributes.findIndex(selectedAttribute => selectedAttribute.attributeId == attribute.attributeId)
                if (index >= 0)
                    setAttributes(attributes => {
                        attributes.splice(index, 1)
                        return attributes.slice()
                    })
                }
            } 
            t={t}
        />

        { error && <p className='error'>{error}</p> }

        <div className={styles.save} onClick={() => handleSave()}><button className={`button_square_white`}>{t('save_variant')}</button></div>
        { onDelete && variant != null && <div className={styles.save} onClick={() => onDelete(variant)}><button className={`button_square_white`}>{t('remove_variant')}</button></div> }
        { onCancel && <div className={styles.save} onClick={onCancel}><button className={`button_square_white`}>{t('cancel')}</button></div> }
        
    </article>

}