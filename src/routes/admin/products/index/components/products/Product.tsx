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

    return dataLoaded && product && <article 
        className={`${styles.product} ${product.disabled == true ? styles.disabled : ''}`}
        id={`${product.id}`} 
        onClick={() => onSelect(product)}>
        <p><span>{t('name')}:</span> {product.name} </p>
        <p><span>{t('description')}:</span> {product.description} </p>
        <p><span>{t('price')}:</span> {coinSymbol} {product.price} </p>
        <p><span>{t('discount')}:</span> {product.discount} % </p>
        { product.attributes && 
            <p><span>{t('attributes')}:</span> {product.attributes.map(attribute => attribute.name).join(" - ")} </p>
        }
    </article>

}

/*



*/