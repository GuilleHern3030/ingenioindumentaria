import { useEffect, useState } from 'react'

import styles from './Variants.module.css'

import addIcon from '@/assets/icons/add.webp'

import Variant from './variant/Variant.tsx'

import useClientInfo from '@/hooks/useClientInfo'

export default ({ variants, variant, nameRef, slugs, onHideVariant, onShowVariant, onSave, onDelete, t }) => {

    const { coinSymbol, dataLoaded } = useClientInfo()

    const handleSave = (variant) => {
        onHideVariant() // ocultar la variante
        onSave(variant)
    }

    const handleDelete = (variant) => {
        onHideVariant() // ocultar la variante
        onDelete(variant)
    }

    const handleSelect = (variant) => {
        onShowVariant(variant) // mostrar la variante
    }

    const handleCancel = () => {
        onHideVariant() // ocultar la variante
    }

    return dataLoaded && <section className={styles.variants}>
        { variants && 
            <>
                { variant !== undefined ? 
                    <>
                        <h5>{t('variants_title')}</h5>
                        <Variant 
                            variant={variant} 
                            nameRef={nameRef} 
                            slugs={slugs}
                            onSave={handleSave} 
                            onDelete={variants?.length > 1 ? handleDelete : null} 
                            onCancel={variants?.length > 0 ? handleCancel : null} 
                            t={t}
                        /> 
                    </> : <>
                        <h5>{t('options_title')}</h5>
                        <div className={styles.options}>
                            { variants.rove((variant, index) => <Option variant={variant} name={parseName(variants, variant.name, nameRef, index)} onClick={handleSelect} currency={coinSymbol} t={t} key={index}/>) }
                            <div className={styles.icon}> <img src={addIcon} onClick={() => handleSelect(null)}/> </div>
                        </div>
                    </>
                }
            </>
        }
    </section>
}

const Option = ({ variant, currency, name, onClick, t }) => {

    const images = variant.images.filter(img => !img.removed)
    const image = images?.length > 0 ? images[0].src : null

    return <div className={styles.option} onClick={() => onClick(variant)}>
        <p>{`${name}`}</p>
        <div>
            { image ?
                <img src={image}/> :
                <p className={styles.option_noimage}>{t('no_image')}</p>
            }
        </div>
        { variant.price && <p> { `${currency} ${variant.price}` } </p> }
        { variant.stock && 
            <> 
                { variant.stock > 0 ? 
                    <p> {t("in_stock")}:<span style={{color:'green'}}> { variant.stock } </span> </p> 
                    : <p style={{color:'brown'}}>{t('no_stock')}</p> 
                } 
            </> 
        }
        { variant.attributes && 
            <div className={styles.option_attributes}>
                { 
                    variant.attributes.map((a,k) => 
                        <p key={k}>{a.attributeName} <span>({a.valueName})</span></p>
                    )
                }
            </div> 
        }
    </div>
}

const parseName = (variants, variantName, nameRef, index) => {
    const name = variantName ?? nameRef?.current?.value
    const names = variants.rove(variant => variant.name).slice(0, index).filter(vName => vName == name)
    return names.length > 0 ? `${name} (${names.length})` : name
}