import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Articles.module.css'

import IdUtils from '@/utils/IdUtils'

import { useScreenWidth } from '@/hooks/useScreen'
import useClientInfo from '@/hooks/useClientInfo'

import Carousel from '@/components/carousel/Carousel'
import Article from '../article/Article'

export default ({ articles, limit, t }) => {

    const [ visible, setVisible ] = useState()
    const { dataLoaded, decimals } = useClientInfo()

    const navigate = useNavigate()
    const width = useScreenWidth()

    const handleArticleSelect = (article) => {
        const serializedId = IdUtils.serialize(article.id)
        navigate("/article/" + serializedId)
    }

    useEffect(() => {
        if (width < 330) setVisible(1)       // Little Mobile
        else if (width < 480) setVisible(2)  // Mobile
        else if (width < 768) setVisible(3)  // Tablet
        else setVisible(4)                   // Desktop
    }, [width])

    return dataLoaded && articles?.length >= 3 && <section>

        <h2 className={styles.title}>{t('outstanding')}</h2>

        { articles.length >= 3 ? 
            visible && 
                <Carousel 
                    visible={visible}
                    items={
                        articles.slice(0, limit >= 3 ? limit : 3)
                        .map((article, key) => 
                            <Article 
                                key={key} 
                                article={article} 
                                digits={decimals}
                                onSelect={handleArticleSelect}
                            />
                        )
                    }
                />
            : <>
            </>
        }
    </section>
}

