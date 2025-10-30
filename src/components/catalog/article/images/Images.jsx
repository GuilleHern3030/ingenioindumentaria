import { useEffect, useState } from "react"
import styles from './Images.module.css'

export default ({images, onImageChange}) => {

    const [ image, setImage ] = useState(0)

    useEffect(() => {
        onImageChange
    }, [image])

    return <div className={styles.imagecontainer} style={{gridTemplateColumns: images.length > 1 ? '2em 1fr 2em' : '1fr'}}>
        {images.length > 1 && <button className={styles.button} onClick={() => setImage(i => i - 1 < 0 ? images.length-1 : i-1)}>{'<'}</button> }
        <img className={styles.image} src={ images.length > 0 ? images[image].src : logo}/>
        {images.length > 1 && <button className={styles.button} onClick={() => setImage(i => i+1 < images.length ? i+1 : 0)}>{'>'}</button> }
    </div>
}