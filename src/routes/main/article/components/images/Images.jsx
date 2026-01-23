import { useState } from 'react'
import styles from './Images.module.css'

import Images from '@/components/images/Images'

export default ({images}) => {

    const [ image, setImage ] = useState(null)

    return <div className={images.length > 0 ? '' : styles.disabled}>

        <Images 
            className={styles.images}
            images={images}
            onImageClick={setImage}
        />
        { image && <Image image={image} onClose={() => setImage(null)}/> }
    
    </div>
}

const Image = ({image, onClose}) => {
    return <div className={styles.background} onClick={onClose}>
        <img 
            className={styles.image}
            src={image}
        />
    </div>
}