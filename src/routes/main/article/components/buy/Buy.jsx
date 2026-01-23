import { useEffect } from 'react'
import styles from './Buy.module.css'

import { 
    usersCanUseShoppingCart,
    usersCanBuy,
    usersCanConsult,
} from '@/api/config.json'

export default ({article, variant, onBuy, onAddShoppingCart, onConsult, onBack, className, t}) => {
    
    return <div className={styles.buy}>
        { usersCanUseShoppingCart && <p className={`${styles.button}`} onClick={() => onAddShoppingCart(article, variant)}>{t('add_cart')}</p> }
        { usersCanBuy && <p className={`${styles.button}`} onClick={() => onBuy(article, variant)}>{t('buy')}</p> }
        { usersCanConsult && <p className={`${styles.button}`} onClick={() => onConsult(article, variant)}>{t('consult')}</p> }
        <div className={styles.exit}>
            <p className={`${styles.button}`} onClick={onBack}>{t('back')}</p>
        </div>
    </div>

}