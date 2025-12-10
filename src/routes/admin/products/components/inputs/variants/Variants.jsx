import { useEffect, useState } from 'react'
import styles from './Variants.module.css'

import addIcon from '@/assets/icons/add.webp'
import removeIcon from '@/assets/icons/remover.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'

import { request } from '@/api'

import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/LogoLoading'
import VariantEditor from './VariantEditor'
import Variant from './Variant'
import { ProductVariant } from '@/api/objects/ProductVariant'

const update = (variants, variant) => {

    let modified = false;
    if (variants) for (let i = 0; i < variants.length; i++) {
        if ((variant.id() && variants[i].id() === variant.id()) || variants[i].isEqual(variant)) {
            variants[i] = variant
            modified = true
        }
    }

    if (!modified)
        variants.push(variant)

    return variants.slice()
}

export default ({product, attributes, defaultVariants=[], onChange, t}) => {

    const [ dialog, setDialog ] = useState(null)

    const [ slug, setSlug ] = useState(null)

    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState()

    const [ editing, setEditing ] = useState(false)

    const [ variants, setVariants ] = useState([])
    useEffect(() => { onChange(variants) }, [variants])
    useEffect(() => { 
        setVariants(ProductVariant.Array(defaultVariants ?? [])) 
    }, [defaultVariants])

    useEffect(() => {
        setVariants(ProductVariant.Array(defaultVariants ?? []))
        setEditing(false)
        //console.log("VARIANTS ATTR:", attributes)
    }, [attributes])

    const handleEdition = (variant, active_setter=undefined) => {
        if (variant) {

            if (active_setter === true) variant.enable()
            else if (active_setter === false) variant.disable()

            console.log("Updating variants", variants)

            const updatedVariants = update(variants, variant)/*variants.filter(v => 
                (variant.id() && v.id() !== variant.id()) &&
                !v.isEqual(variant)
            )*/

            console.log("updatedVariants", updatedVariants)

            //updatedVariants.push(variant)

            setVariants(updatedVariants.slice())
            
        }
        setEditing(false)
        setDialog(undefined)
    }

    const handleDelete = (variant) => {
        if (variant) {
            setDialog(<Dialog 
                title={t(variant.isActive() ? 'disable_variant' : 'delete_variant')}
                message={t(variant.isActive() ? 'editor_disable_message' : 'editor_delete_message')}
                onReject={() => setDialog(undefined)}
                onAccept={variant.isActive() ? () => handleEdition(variant, false) : () => {
                    const updatedVariants = variants.filter(v => v.id() !== variant.id())
                    setVariants(updatedVariants)
                    setDialog(undefined)
                }}
            />)
        }
        setEditing(false)
    }

    return attributes?.length > 0 && <>
    <hr/>
    { isLoading ? <Loading/> :
        <section className={styles.variants}>

            { editing === false && // No se está editando nada
                <>
                    { variants?.length > 0 ? 
                        variants?.map((variant, key) => 
                            <Variant 
                                key={key}
                                product={product} 
                                attributes={attributes}
                                variant={new ProductVariant(variant)} 
                                handleEdit={setEditing} 
                                t={t}
                            />
                        ) 
                        : // Si no hay variantes aún, se explica qué es
                        <>
                            <p className={styles.instruction}>{t('variant_instruction_1')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_2')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_3')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_4')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_5')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_6')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_7')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_8')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_9')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_10')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_11')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_12')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_13')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_14')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_15')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_16')}</p>
                            <p className={styles.instruction}>{t('variant_instruction_17')}</p>
                        </>
                    }

                    <div className='flex-center-column'>
                        <button 
                            onClick={() => setEditing(null)}
                            className={`button_square_white ${styles.add}`}
                            > {t('add_variant')}
                        </button>
                    </div>
                </>
            }

            { editing !== false && // Creando/Editando variante
                <VariantEditor 
                    product={product} 
                    attributes={attributes}
                    variant={editing}
                    onSubmit={handleEdition}
                    onDelete={handleDelete}
                    onEnable={(variant) => handleEdition(variant, true)}
                    onCancel={() => setEditing(false)}
                    t={t}
                />
            }

            {dialog}

        </section>
    }
    <hr/>
    </>
}