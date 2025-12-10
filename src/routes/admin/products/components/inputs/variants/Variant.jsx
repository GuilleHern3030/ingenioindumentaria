import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './Variant.module.css'

import addIcon from '@/assets/icons/add.webp'
import removeIcon from '@/assets/icons/remover.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'

import { request } from '@/api'

import Loading from '@/components/loading/LogoLoading'
import Image from '@/components/image/Image'

// variant: ProductVariant obj
export default ({product, variant, attributes, handleEdit, t}) => {

    const [ variantAttributes, setVariantAttributes ] = useState([])
    const [ height, setHeight ] = useState(0)

    const variantRef = useRef()
    //console.log("VARIANT variant: ", variant)

    useEffect(() => {
        const variantAttributes = variant.attributes().map(attribute => {
            const attributeData = attributes.get(attribute.attributeId)
            //console.log("attribute.attributeId:", attribute.attributeId)
            //console.log("attributeData:", attributeData)
            return {
                attribute: attributeData,
                selected: attributeData ? attributeData.get(attribute.valueId) : undefined
            }
        })
        //console.log("VARIANT variantAttributes: ", variantAttributes)
        setVariantAttributes(variantAttributes)
    }, [variant, attributes, product])

    useLayoutEffect(() => { setHeight(variantRef.current.clientHeight) })
    
    return <>
        <article ref={variantRef} onClick={() => handleEdit(variant)} className={styles.article}>

            <div>

                { variant && variant.isActive() === false && <div className={styles.disabled} onClick={() => {}} style={{height:height}}><p>{t('disabled')}</p></div> }
                { /* <p className={styles.name}>{`${product.name()} (${variant.id() ?? 'new'})`}</p> */ }

                { variant.description() && 
                    <div className={styles.div}>
                        <p className={styles.title}>{`${t('description')}`}</p>
                        <p className={styles.text}>{`${variant.description()}`}</p>
                    </div> 
                }
                
                { variant.price() > 0 && 
                    <div className={styles.div}>
                        <p className={styles.title}>{t('price')}</p>
                        <p className={styles.text}>{`${variant.price()} $`}</p>
                    </div> 
                }
                
                { variant.discount() > 0 && 
                    <div className={styles.div}>
                        <p className={styles.title}>{t('discount')}</p>
                        <p className={styles.text}>{`${variant.discount()} %`}</p>
                    </div> 
                }
                
                { variant.inStock() !== undefined && 
                    <div className={styles.div}>
                        <p className={styles.title}>{`${t('in_stock')}`}</p>
                        <p className={styles.text}>{`${variant.inStock() == undefined ? t('yes') : variant.inStock()}`}</p>
                    </div> 
                }

                <p className={styles.variants}>{t('variants')}</p>
                { variantAttributes.length > 0 &&
                    variantAttributes
                    .filter(obj => obj.selected)
                    .map((obj, key) => <div className={styles.variant} key={key}>
                        <div className={styles.value}>
                            <p className={styles.attribute}>{obj.attribute.name()}:</p>
                            { obj.selected && <p style={{paddingLeft:'1em'}}>{obj.selected?.name}</p> }
                        </div>
                    </div>)
                }

            </div>

            <div className={styles.image}>
                { variant.image() ?
                    <Image
                        src={variant.image()}
                    /> : <p>{t('no_image')}</p>
                }
            </div>

        </article>
        <hr/>
    </>

}