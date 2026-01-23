import { useState, useEffect, useRef } from 'react'

import styles from './Images.module.css'

import Alert from '@/components/alert/Alert'
import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/FullLoading'

import { maxImagesSizePerProduct, maxImagesPerProduct } from '@/api/config.json'

import ImageUtils from '../../../../utils/ImageUtils'
import Size from '../../../../../../../utils/SizeUtils'

import remove from '@/assets/icons/remove.webp'
import recover from '@/assets/icons/recover.webp'

const filteredImages = (images, handleImage, removed=false, t) => 
    images.filter(img => img.removed == removed || img.removed == undefined && removed == false)
    .map((img, index) =>
        <div key={index} className={styles.imagedetailedcontainer}>
            <img src={img.src} className={`${styles.imagedetailed} ${removed && styles.imagedetailedremoved}`}></img>
            { img.size && <p>{Size.toString(img.size)}</p> }
            <img src={ !removed ? remove : recover} className={styles.remover} onClick={() => handleImage(img)}/> 
        </div>
    )

export default ({ images=[], onAdd, onRemove, onRestore, t }) => {

    const input = useRef()

    const [ dialog, setDialog ] = useState(null)
    const [ isShowingRemovedImages, setIsShowingRemovedImages ] = useState(false)

    const handleUploadImage = e => {

        // Obtener el file del evento
        const file = e.target.files[0]
        if (!file) return;

        // Oculta la visualización de imágenes borradas
        setIsShowingRemovedImages(false) 

        // Chequear que el formato del file es válido
        const isFileValid = ImageUtils.isValid(file)
        if (isFileValid !== true) 
            return setDialog(<Alert title={t('image_error')} message={t(`image_error_${isFileValid}`)} onAccept={() => setDialog(null)}/>)
        
        // Verificar que se cumple el formato de todas las imágenes
        const areImagesValid = ImageUtils.areValid(images.filter(img => !img.removed), file.size)
        if (areImagesValid !== true) 
            return setDialog(<Alert title={t('image_error')} message={t(`image_error_${areImagesValid}`)} onAccept={() => setDialog(null)}/>)

        // Construir un FormData con la imagen
        const formData = new FormData()
        formData.append('image', file)

        // Construir el objeto imagen
        const imageObject = {
            size: file.size,
            src: URL.createObjectURL(file),
            removed: false,
            file,
            formData
        }

        // Añadirla a la lista de imágenes (como copia)
        onAdd(imageObject)

    }

    const handleRestoreImage = (img) => {
        if (!img?.removed) return; // si no está borrado, cancela
        setDialog(
            <Dialog
                title={t('editor_recove_image')}
                message={<img className={styles.dialog} src={img.src}/>}
                onReject={() => setDialog(null)}
                onAccept={() => {
                    setDialog(null)

                    // Verificar que se cumple el formato de todas las imágenes
                    const areImagesValid = ImageUtils.areValid(images.filter(img => !img.removed), img.size)
                    if (areImagesValid !== true) 
                        return setDialog(<Alert title={t('image_error')} message={t(`image_error_${isFileValid}`)} onAccept={() => setDialog(null)}/>)

                    // Marcar la imagen como no removida
                    img.removed = false

                    // Recargar la lista de imágenes (como copia)
                    onRestore(img)
                }}
            /> 
        )
    }

    const handleRemoveImage = (img) => {
        if (img?.removed == true) return; // si ya está borrado, cancela
        setIsShowingRemovedImages(false) // oculta la visualización de imágenes borradas
        setDialog(
            <Dialog
                title={t('editor_remove_image')}
                message={<img className={styles.dialog} src={img.src}/>}
                onReject={() => setDialog(null)}
                onAccept={() => {
                    setDialog(null)
                    img.removed = true
                    onRemove(img)
                }}
            /> 
        )
    }

    return <>
        <h6>{t('images')}</h6>
        <div className={styles.images}>
        
            { images?.length > 0 &&
                <div id='images' className={styles.imagesdetailed}>
                    { filteredImages (images, handleRemoveImage, false)}
                </div>
            }     

            <p className={styles.info}> { `${t('images')}: ${images?.filter(img => !img.removed).length} / ${maxImagesPerProduct}` } </p>   
            <p className={styles.info}> { `${Size.toString(images?.filter(img => !img.removed).map(image => image.size).reduce((acc, n) => acc + (n ?? 0), 0))} / ${Size.toString(maxImagesSizePerProduct)}` } </p>   

            { images?.filter(img => !img.removed).length < maxImagesPerProduct &&
                <div id='image-adder' className='flex-center'>
                    <button className={styles.button} onClick={() => input.current.click()}>{t('add_new_image')}</button>
                    <input 
                        ref={input}
                        className={styles.input} 
                        type='file' 
                        onChange={handleUploadImage} 
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                </div>
            }

            { isShowingRemovedImages &&
                <div id='removed-images' className={styles.imagesdetailed}>
                    { filteredImages (images, handleRestoreImage, true)}
                </div>
            }

            { images.filter(img => img?.removed).length > 0 &&
                <div id='image-recover' className='flex-center'>
                    <button className={styles.button} onClick={() => setIsShowingRemovedImages(prev => !prev)}>
                        { isShowingRemovedImages ? 
                            t('hide_removed_images') :
                            t('show_removed_images')
                        }
                    </button>
                </div>
            }
            
            { dialog }

        </div>
    </>

}