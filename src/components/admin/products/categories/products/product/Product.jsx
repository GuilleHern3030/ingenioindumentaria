import { useState } from 'react'
import styles from './Product.module.css'

export default ({article, onEditRequest}) => {

    const [ showingImage, setShowingImage ] = useState()
    
    try {

        const images = article.images()

        return <div id={article.id()} className={styles.product}>

            {
                showingImage ? 
                    <div 
                        className={styles.bigimagecontainer} 
                        onClick={() => setShowingImage(undefined)}>
                            <img className={styles.bigimage} src={showingImage}/>
                    </div> : <></>
            }

            <div className={styles.productdata} onClick={() => onEditRequest(article.id())}>
                <p>Nombre: {article.name()}</p>
                <p>Descripcion: {article.description()}</p>
                <p>Descuento: {article.discount()}%</p>
                { article.discount() > 0 ? 
                    <p>Precio: <strike>${article.price()}</strike> <i>${article.price() * article.discount() / 100}</i></p> :
                    <p>Precio: ${article.price()}</p>
                }
                <p>Sexo: {article.sexName()}</p>
                <p>Talles: {article.sizes().join(", ")}</p>
                <p>En stock: { article.inStock().map(stock => stock === true ? "Si" : stock === false ? "No" : stock).join(", ") }</p> 
                <p className={styles.date}>Fecha: {article.date().complete}</p>
                { article.recent() === true ? <p className={styles.recent}>Es reciente</p> : <></> }
            </div>
            { images.length > 0 ? <div className={styles.images}>
                { images.length > 0 ? <img className={styles.image} src={article.getImage(0).src} onClick={() => setShowingImage(article.getImage(0).src)}/> : <></> }
                { images.length > 1 ? <p> +{(images.length-1)} </p>: <></> }
            </div> : <></>
            }
        </div>
    } catch(e) {
        console.error("Once product has an error", e, article)
        return null
    }

}