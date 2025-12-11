import { useEffect } from 'react'
import styles from './Buy.module.css'

import { 
    usersCanUseShoppingCart,
    usersCanBuy,
    usersCanConsult,
} from '@/api/config.json'

export default ({article, variant, onBuy, onAddShoppingCart, onConsult, className, t}) => {
    
    useEffect(() => {
        if (variant)
            console.log("%cVARIANT", "color:blue; background:pink; padding:4px; border:1px solid blue;", variant)
        else console.log("%cNO VARIANT", "color:red; background:pink; padding:4px; border:1px solid blue;")
    }, [variant])

    return <div className={styles.buy}>
        { usersCanUseShoppingCart && <p className={`${styles.button}`} onClick={() => onAddShoppingCart(article, variant)}>{t('add_cart')}</p> }
        { usersCanBuy && <p className={`${styles.button}`} onClick={() => onBuy(article, variant)}>{t('buy')}</p> }
        { usersCanConsult && <p className={`${styles.button}`} onClick={() => onConsult(article, variant)}>{t('consult')}</p> }
    </div>

}