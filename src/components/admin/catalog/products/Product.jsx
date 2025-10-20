import styles from './Product.module.css'

export default function({article, index, onClick}) {

    try {

        const images = article.images()

        return <div id={article.id()} onClick={() => onClick(article)} className={styles.product}>
            <div className={styles.productdata}>
                <p>Nombre: {article.name()}</p>
                <p>Descripcion: {article.description()}</p>
                <p>Descuento: {article.discount()}%</p>
                { article.discount() > 0 ? 
                    <p>Precio: <strike>${article.price()}</strike> <i>${article.price() * article.discount() / 100}</i></p> :
                    <p>Precio: ${article.price()}</p>
                }
                <p>Sexo: {article.sex()}</p>
                <p>Talles: {article.sizes()}</p>
                <p>En stock: { article.inStock() === true ? "Si" : article.inStock() === false ? "No" : article.inStock() } 
                </p> 
                <p className={styles.date}>Fecha: {article.date().complete}</p>
                { article.recent() === true ? <p className={styles.recent}>Es reciente</p> : <></> }
            </div>
            { images.length > 0 ? <div className={styles.images}>
                { images.length > 0 ? <img className={styles.image} src={article.getImage(0).src}/> : <></> }
                { images.length > 1 ? <p> +{(images.length-1)} </p>: <></> }
            </div> : <></>
            }
        </div>
    } catch(e) {
        console.error("Once product has an error", e, article, index)
        return null
    }
}