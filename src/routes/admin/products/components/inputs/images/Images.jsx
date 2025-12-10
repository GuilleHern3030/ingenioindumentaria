import { useState, useEffect, useRef } from 'react'

import styles from './Images.module.css'

import Alert from '@/components/alert/Alert'
import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/FullLoading'

import { Image } from '@/api/objects/Image'
import { maxImagesPerProduct } from '@/api/config.json'
import Size from '@/utils/SizeUtils'

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

export default ({defaultImages=[], onChange, t}) => {

    const input = useRef()

    const [ dialog, setDialog ] = useState(null)
    const [ isShowingRemovedImages, setIsShowingRemovedImages ] = useState(false)

    const [ images, setImages ] = useState([])
    useEffect(() => { onChange(images) }, [images])
    useEffect(() => { setImages(defaultImages) }, [defaultImages])

    const handleUploadImage = e => {

        // Obtener el file del evento
        const file = e.target.files[0]
        if (!file) return;

        // Oculta la visualización de imágenes borradas
        setIsShowingRemovedImages(false) 

        // Chequear que el formato del file es válido
        const isFileValid = Image.isValid(file)
        if (isFileValid !== true) 
            return setDialog(<Alert title={isFileValid.error} message={isFileValid.message} onAccept={() => setDialog(null)}/>)
        
        // Verificar que se cumple el formato de todas las imágenes
        const areImagesValid = Image.areValid(images.filter(img => !img.removed), file.size)
        if (areImagesValid !== true) 
            return setDialog(<Alert title={areImagesValid.error} message={areImagesValid.message} onAccept={() => setDialog(null)}/>)

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
        images.push(imageObject)
        setImages(images.slice())

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
                    const areImagesValid = Image.areValid(images.filter(img => !img.removed), img.size)
                    if (areImagesValid !== true) 
                        return setDialog(<Alert title={areImagesValid.error} message={areImagesValid.message} onAccept={() => setDialog(null)}/>)

                    // Marcar la imagen como no removida
                    img.removed = false

                    // Recargar la lista de imágenes (como copia)
                    setImages(images.slice())
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

                    // Marcar la imagen como removida
                    img.removed = true

                    // Recargar la lista de imágenes (como copia)
                    setImages(images.slice())
                }}
            /> 
        )
    }

    return <div className={styles.images}>
    
        { images?.length > 0 &&
            <div id='images' className={styles.imagesdetailed}>
                { filteredImages (images, handleRemoveImage, false)}
            </div>
        }        

        { images?.length < maxImagesPerProduct &&
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

}