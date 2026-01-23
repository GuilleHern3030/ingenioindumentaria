import { useEffect, useState } from 'react'
import styles from './Article.module.css'

import Image from '@/components/image/Image'
import useClientInfo from '@/hooks/useClientInfo'
import { useCommonI18n } from '@/hooks/useRouteI18N'

const getImage = (article, alt=undefined, index=0) => {
    try {
        const images = article.images
        const image = images[index]
        return image?.src ?? alt
    } catch(e) { return alt }
}

const salePrice = (article, digits) =>
    article.discount > 0 ?
        (Number(article.price) - Number(article.price) * article.discount / 100).toFixed(digits) :
        Number(article.price).toFixed(digits)

export default ({ article, summary, digits, onSelect, alt, selected=false }) => {

    const { t } = useCommonI18n()

    const { decimals, dataLoaded, coinSymbol } = useClientInfo()

    return dataLoaded && <article 
        id={article.id} 
        className={`${styles.article} ${selected ? styles.selected : ''}`}
        onClick={() => onSelect(article.id)}
        >

        <Image
            src={getImage(article, alt)}
            alt={article.name}
            className={styles.image}
            bottomText={article.discount > 0 && article.price ? `-${article.discount}%` : null}
            topText={article.newest === true ? t('common:new') : null}
        />

        { !summary &&
            <div className={styles.info}>
                <p className={styles.name}>{article.name}</p>

                { article.price && 
                    <div className={styles.price}>
                        { article.discount > 0 ? 
                            <>
                                <p className={styles.strike}>{article.price}</p>
                                <p>{`${salePrice(article, decimals)} ${coinSymbol}`}</p>
                            </>
                            : <p>{`${salePrice(article, decimals)} ${coinSymbol}`}</p>
                        }

                    </div>
                }


            </div>
        }


    </article>

}