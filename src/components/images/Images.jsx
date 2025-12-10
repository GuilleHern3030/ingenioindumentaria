import { useEffect, useState } from "react"
import styles from './Images.module.css'
import logo from '@/assets/icons/logo2.webp'

export default ({className, images, onImageChange, onImageClick}) => {

    const [ image, setImage ] = useState(0)

    useEffect(() => { onImageChange }, [image])

    const handleButtonClick = (e, forward) => {
        e.stopPropagation()
        if (forward === false)
            setImage(i => i - 1 < 0 ? images.length-1 : i-1)
        else setImage(i => i+1 < images.length ? i+1 : 0)
    }

    return <div className={`${styles.imagecontainer} ${className??''}`}>

        <img 
            className={styles.image} 
            onClick={() => onImageClick(images.length > 0 ? images[image].src : null)} 
            src={ images.length > 0 ? images[image].src : logo }
        />

        <div className={styles.buttons} onClick={() => onImageClick(images.length > 0 ? images[image].src : null)}>
            {images.length > 1 && <button className={styles.button} onClick={e => handleButtonClick(e,false)}>{'<'}</button> }
            {images.length > 1 && <button className={styles.button} onClick={e => handleButtonClick(e, true)}>{'>'}</button> }
        </div>

    </div>
}