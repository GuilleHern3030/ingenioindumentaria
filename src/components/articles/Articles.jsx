import { useEffect, useState } from "react"
import styles from './Article.module.css'

import { lazyLoadLimit } from '@/api/config.json'
import Product from "@/api/products"

import PageSelector from '@/components/page/PageSelector'
import useClientInfo from '@/hooks/useClientInfo'

import Article from "./Article"
import Empty from './Empty'

export default ({className, articles, columns=2, onSelect, pages, page, onPageChange }) => {

    const [ screenBig, setScreenBig ] = useState()
    const { data } = useClientInfo()

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

    return (!articles || articles.length == 0) ? <Empty/> : data && articles && <section 
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
                                    article={new Product(article)}
                                    summary={columns >= 3}
                                    onSelect={onSelect}
                                    digits={data.digits}
                                />
                        )}

                        <PageSelector
                            page={page}
                            pages={Math.ceil((articles?.length ?? 1) / lazyLoadLimit)}
                            onChange={onPageChange}
                        />

                    </>
                }
            </>
        }
    </section>
}