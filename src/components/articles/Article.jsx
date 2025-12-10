import { useEffect, useState } from 'react'
import styles from './Article.module.css'

import Image from '@/components/image/Image'
import useClientInfo from '@/hooks/useClientInfo'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export default ({article, summary, digits, onSelect}) => {

    const { t } = useCommonI18n()

    const { data } = useClientInfo()

    return <article 
        id={article.id()} 
        className={styles.article}
        onClick={() => onSelect(article.id())}
        >

        <Image
            src={article.image()}
            alt={article.name()}
            className={styles.image}
            bottomText={article.discount() > 0 ? `-${article.discount()}%` : null}
            topText={article.isRecent() ? t('common:new') : null}
        />

        { !summary &&
            <div className={styles.info}>
                <p className={styles.name}>{article.name()}</p>

                <div className={styles.price}>
                    { article.discount() > 0 ? 
                        <>
                            <p className={styles.strike}>{article.price()}</p>
                            <p>{`${article.salePrice(digits)} ${data?.coinSymbol}`}</p>
                        </>
                        : <p>{`${article.salePrice(digits)} ${data?.coinSymbol}`}</p>
                    }

                </div>


            </div>
        }


    </article>

}