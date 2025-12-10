import { Outlet } from 'react-router-dom'
import styles from './Product.module.css'
import { useLayoutEffect, useRef, useState } from 'react'

export default ({product, onProductSelected, t}) => {

    const [ height, setHeight ] = useState(0)
    const productRef = useRef()
    useLayoutEffect(() => { setHeight(productRef.current.clientHeight) }, [])

    return <article ref={productRef} id={product.id()} className={styles.product}>
        { product.isActive() === false && <div className={styles.disabled} onClick={() => onProductSelected(product)} style={{height:height}}><p>{t('disabled')}</p></div> }
        <div className={styles.productdata} onClick={() => onProductSelected(product)}>

            <div className={styles.object}>
                <p className={styles.key}>{`${t('name')}:`}</p>
                <p className={styles.value}>{product.name()}</p>
            </div>

            <div className={styles.object}>
                <p className={styles.key}>{`${t('description')}:`}</p>
                <p className={styles.value}>{product.description()}</p>
            </div>

            {/*<p>Nombre: {article.name()}</p>*/}
            {/*<p>Descuento: {article.discount()}%</p>*/}
            {/* article.discount() > 0 ? 
                <p>Precio: <strike>${article.price()}</strike> <i>${article.price() - article.price() * article.discount() / 100}</i></p> :
                <p>Precio: ${article.price()}</p>
            */}
        </div>

    </article>
}