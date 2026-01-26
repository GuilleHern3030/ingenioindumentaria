import useClientInfo from '@/hooks/useClientInfo'
import styles from './Products.module.css'

import product from '@/api/models/Product'


interface props {
    product: product,
    onSelect: any,
    t: Function,
}

export default (props: props) => {

    const { coinSymbol, dataLoaded } = useClientInfo()

    const { product, onSelect, t } = props

    const price = product.variants?.map(variant => variant.price).reduce((total, n) => total + n, 0)
    console.log(price)

    return dataLoaded && product && <article 
        className={`${styles.product} ${product.disabled == true ? styles.disabled : ''}`}
        id={`${product.id}`} 
        onClick={() => onSelect(product)}>
        <p><span>{t('name')}:</span> {product.name} </p>
        <p><span>{t('description')}:</span> {product.description} </p>
        { <Price price={price} discount={product.discount} coinSymbol={coinSymbol} t={t} /> }
        { product.attributes && 
            <p><span>{t('attributes')}:</span> {product.attributes.map(attribute => attribute.name).join(" - ")} </p>
        }
    </article>

}

const Price = ({ price, discount, coinSymbol, t }) => {
    if (!price) return <></>
    else if (discount == 0) return <p><span>{t('price')}:</span> {coinSymbol} {price} </p>
    else return <p>
        <span>{t('price')}:</span> 
        <span className={styles.strike}>{coinSymbol}{price}</span>
        <span className={styles.discount}>-{discount}%</span>
        { coinSymbol }{ (price - price * discount / 100).toFixed(2) }
    </p>
}

/*



*/