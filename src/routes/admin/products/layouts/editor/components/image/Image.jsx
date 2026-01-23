import { useRef } from 'react'

import { maxImageSize, imagesType } from '@/api/config.json'

import styles from './Image.module.css'

import Image from '../../utils/ImageUtils'
import Size from '../../../../../utils/SizeUtils'

export default ({ image, onSelect, onRemove, onError, t }) => {

    const input = useRef()

    const handleUploadImage = e => {

        // Obtener el file del evento
        const file = e.target.files[0]
        if (!file) return;

        // Chequear que el formato del file es válido
        const isFileValid = Image.isValid(file)
        if (isFileValid === 1) return onError(`${t('image_error_1')} (${Size.toString(maxImageSize)})`)
        else if (isFileValid === 2) return onError(`${t('image_error_2')} (${imagesType.join(", ")})`)
        else if(isFileValid === true) {

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

            // Retornar imagen
            onSelect(imageObject)
        }
    }

    const handleClick = () => {
        image ?
            onRemove(image)
            : input?.current.click()
    }

    return <>
        <div className={styles.image}>
            <div 
                onClick={handleClick}
                className={styles.button}>
                { image ? 
                    <img src={image.src} />
                    : <>
                            { t('add_image') }
                    </>
                }   
                <input 
                    ref={input}
                    className={styles.input} 
                    type='file' 
                    onChange={handleUploadImage} 
                    accept="image/*"
                    style={{ display: "none" }}
                />   
            </div>
        </div> 
        { image && <p className={styles.description}>{Size.toString(image.size)}</p> }
    </>

}