import useClientInfo from '@/hooks/useClientInfo'
import styles from './Price.module.css'
import { devMode } from '@/api'

/**
 * price: {number} Precio original del producto
 * discount: {number} Descuento del producto
 * installments: {number[]} Cuotas en que se puede comprar un producto
 * fees: {number} Porcentaje de impuestos
 */
export default ({ price, discount=0, installments=0, installmentsPrice=0, fees=0, multiplier=1, t }) => {

    const { dataLoaded, coinSymbol, decimals } = useClientInfo()

    return dataLoaded && price && <div className={styles.container}>

        {/* Descuento */}
        { (discount > 0) && 
            <div className={styles.div}>
                <p className={styles.strike}><strike>{`${coinSymbol} ${price*multiplier}`}</strike></p>
                <p className={styles.discount}><b>{`-${discount}%`}</b></p>
            </div>
        }

        {/* Precio */}
        <p className={styles.price}>{`${coinSymbol} ${discount > 0 ? ((price - price * discount / 100)*multiplier).toFixed(decimals) : price*multiplier}`}</p>

        { (installments > 0) && // Cuotas
            <div className={styles.div}>
                <p className={styles.installments}>{`${installments} ${t('installments-free-interest')} `}</p>
                <p className={styles.installments_price}><b>{`${coinSymbol}${installmentsPrice*multiplier}*`}</b></p>
            </div>
        }

        { (fees > 0) && // Precio sin impuestos
            <p className={styles.price_no_fees}>{`${t('price_no_iva')} ${coinSymbol}${((price - price * fees / 100)*multiplier).toFixed(decimals)}`}</p> 
        }


    </div>

}