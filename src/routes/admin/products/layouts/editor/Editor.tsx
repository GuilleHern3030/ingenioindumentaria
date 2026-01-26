import { useEffect, useRef, useState } from 'react'
import styles from './Editor.module.css'

// Images
import closeIcon from '@/assets/icons/cancel.webp'
import deleteIcon from '@/assets/icons/delete.webp'
import saveIcon from '@/assets/icons/accept.webp'

// Hooks
import useClientInfo from '@/hooks/useClientInfo'
import useProductData from './hooks/useProductData'

// Utils
import Slugs from './utils/SlugsUtils'

// Objects
import Articles from './utils/Articles'
import image from '@/api/models/Image'
import variant from '@/api/models/Variant'

// Global Components
import Dialog from '@/components/dialog/Dialog'
import Alert from '@/components/alert/Alert'

// Admin Components
import InputComponent from '../../../components/input/Input'
const Input = InputComponent as React.FC<any>

// Components
import Categories from './components/categories/Categories'
import Variants from './components/variants/Variants'
import Image from './components/image/Image'

export default ({ onSuccess, onCancel, onDelete, t }) => {

    const { product, categories, parseData, slug } = useProductData()

    // ClientData
    const { coinSymbol, dataLoaded } = useClientInfo()

    // Dialog
    const [ dialog, setDialog ] = useState(null)
    const [ warning, setWarning ] = useState(null)

    // Selected attributes
    //const [ selectedAttributes, setSelectedAttributes ] = useState<Array<attribute>>([])
    const [ selectedSlugs, setSelectedSlugs ] = useState<Array<string>>([])
    const [ catalogImage, setCatalogImage ] = useState<image>(null)

    // Variants
    const [ variants, setVariants ] = useState<Articles>(null)
    const [ variant, setVariant ] = useState<any>(undefined)

    useEffect(() => { 

        console.log("%cPRODUCT LOADED", "color:blue; background:pink; padding:4px; border:1px solid blue;", product)

        const articles = new Articles(product?.variants ?? [])
        console.log("Variants", articles)

        setSelectedSlugs(Slugs.getSelected(product?.categories, slug)) // array de strings (slugs)
        setCatalogImage(product?.images ? product.images[0] : undefined)
        setVariants(articles)
        setVariant(variants?.length > 0 ? 
            undefined // Se mostrarán los inputs para crear una variante
            : null) // Se mostrará la lista de variantes para elegir (incluso si hay uno solo)

    }, [ product ])

    const name = useRef<HTMLInputElement>(null)
    const description = useRef<HTMLInputElement>(null)
    const isRecent = useRef<HTMLInputElement>(null)
    const isActive = useRef<HTMLInputElement>(null)

    const showDialog = (title:string, message:string, funcOnAccept) => {
        setDialog(<Dialog
            title={title}
            message={message}
            onAccept={() => { setDialog(null); funcOnAccept() } }
            onReject={() => setDialog(null)} 
            children={undefined}
        />)
    }

    const handleCancel = () => {
        showDialog(
            t('editor_cancel_title'), 
            t('editor_cancel_message'),
            onCancel
        )
    }

    const handleSaveVariant = (variant:variant) => {
        setVariants((variants:Articles) => variants.put(variant))
    }

    const handleSave = () => {
        //const productData = getProductData()
        if (name?.current?.value?.trim().length > 0) {
            if (variants.valid()) {
                if (Number(variants?.price()) > 0) {

                    const parsedData = parseData(
                        product?.id ?? null,
                        name.current.value.trim(),
                        description.current.value.trim(),
                        isRecent.current.checked,
                        !(isActive.current ? isActive.current.checked : true),
                        catalogImage,
                        selectedSlugs,
                        variants
                    )

                    console.log("ParsedData:", parsedData)
                    showDialog(
                        t('editor_save_title'), 
                        t('editor_save_message'),
                        () => onSuccess(parsedData)
                    )
                } else setWarning(t('editor_invalid_price'))
            } else setWarning(t('editor_invalid_price'))
        } else setWarning(t('editor_invalid_name'))
    }

    const handleDelete = () => {
        showDialog(
            t('editor_remove_title'), 
            product?.disabled !== true ? 
                t('editor_disable_message') : 
                t('editor_delete_message'), 
            () => onDelete(product)
        )
    }

    return <>

        { product?.disabled === true && <p className='warning'>{t('product_disabled')}</p>}
        
        { warning && <p className='error'>{warning}</p>}
        
        <Categories 
            categories={categories}
            slugs={selectedSlugs}
            onAdd={(slug:string) => {
                if (!selectedSlugs.includes(slug)) 
                    setSelectedSlugs(slugs => {
                        slugs.push(slug)
                        return slugs.slice()
                    })
                }
            }
            onRemove={(slug:string) => {
                const index = selectedSlugs.indexOf(slug)
                if (index >= 0)
                    setSelectedSlugs(slugs => {
                        slugs.splice(index, 1)
                        return slugs.slice()
                    })
                }
            }
            t={t}
        />

        { dataLoaded && variants && // Datos que se mostrarán en el catálogo
            <section className={styles.catalog}>
                <h4 className={styles.catalog_title}>{ t('catalog_title') }</h4>
                <Input ref={name} name='name' className={styles.input} label={t("name")} defaultValue={product?.name}/>
                <Input ref={description} name='description' className={styles.input} label={`${t("description")}`} defaultValue={product?.description}/>
                <Input ref={isRecent} className={styles.input} label={`${t('is_new')}:`} type='checkbox' defaultChecked={product === null ? true : product?.isRecent}/>
                { (product?.disabled || !product) && <Input ref={isActive} className={styles.input} label={`${t('is_available')}:`} type='checkbox' defaultChecked={!product?.disabled}/> }
                { variants.valid() && <p className={styles.input}>{`${t('in_stock')}: ${variants.stock() ?? t('undefined')}`} <span></span></p> }
                { variants.valid() && <p className={styles.input}>{`${t('price')}: ${variants.value(coinSymbol) ?? t('undefined')}`} <span></span></p> }
                <Image 
                    image={catalogImage} 
                    onSelect={(image:image) => setCatalogImage(image)} 
                    onError={(warning:string) => setWarning(warning)}
                    onRemove={() => showDialog(t('image'), t('editor_remove_image'), () => setCatalogImage(null))}
                    t={t}
                />
            </section>
        }

        <hr style={{marginTop:'1.5em', marginBottom:'1.5em'}}/>

        <Variants 
            variants={variants}
            variant={variant}
            nameRef={name}
            slugs={selectedSlugs}
            onHideVariant={() => setVariant(undefined)}
            onShowVariant={(variant:variant) => setVariant(variant)}
            onSave={handleSaveVariant}
            onDelete={(variant:variant) => setVariants((variants:Articles) => variants.delete(variant)) }
            t={t}
        />

        <hr style={{marginTop:'1.5em', marginBottom:'1.5em'}}/>
        
        { warning && <p className='error'>{warning}</p>}

        { variant === undefined ? 
            <section className={styles.footer}>
                <div className={styles.icon}> <img src={closeIcon} onClick={handleCancel}/> </div>  
                <div className={styles.icon}> { product && <img src={deleteIcon} onClick={handleDelete}/> } </div>
                <div className={styles.icon}> <img src={saveIcon} onClick={handleSave}/> </div>
            </section> : <div className={`${styles.icon} ${styles.close}`}> <img src={closeIcon} onClick={handleCancel}/> </div>
        }

        { warning && <Alert
            onAccept={() => setWarning(undefined)}
            title={t('error')} message={undefined}> 
                <p className='error'>{warning}</p> 
            </Alert>
        }

        { dialog }

    </>

}