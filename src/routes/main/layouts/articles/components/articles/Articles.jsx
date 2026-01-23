import { useEffect, useState } from "react"
import styles from './Article.module.css'

import { lazyLoadLimit } from '@/api/config.json'

import PageSelector from '@/components/page/PageSelector'
import useClientInfo from '@/hooks/useClientInfo'

import Article from "./Article"
import Empty from './Empty'

export default ({className, articles, columns=2, digits, onSelect, onEmptyClick, pages, page, onPageChange, t }) => {

    const [ screenBig, setScreenBig ] = useState()

    const handleMediaQuery = (e) => {
        if (e.matches) { // Pantalla <= 768px
            setScreenBig(false)
        } else { // Pantalla > 768px
            setScreenBig(true)
        }
    }

    useEffect(() => { 
        const mediaQuery = window.matchMedia("(max-width: 768px)")
        mediaQuery.addEventListener("change", handleMediaQuery)
        handleMediaQuery(mediaQuery) 
    }, [])

    return (!articles || articles.length == 0) ? <Empty onClick={onEmptyClick}/> : articles && <>
        
        <section 
            className={`${styles.articles} ${className??''}`}
            style={{gridTemplateColumns:`repeat(${screenBig ? columns * 2 : columns}, 1fr)`}}
            >{
                Array.isArray(articles) && 
                <>
                    { articles.length > 0 &&
                        <>
                            { articles.map(
                                (article, key) => 
                                    <Article 
                                        key={key}
                                        article={article}
                                        summary={columns >= 3}
                                        onSelect={onSelect}
                                        digits={digits}
                                    />
                            )}

                        </>
                    }
                </>
            }
        </section>

        <PageSelector
            page={page}
            pages={pages}
            onChange={onPageChange}
            t={t}
        />
        
    </>
}




