import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'

import useIndexedDB from "../../hooks/useIndexedDB"

import catalog from "./Catalog.json"
import styles from "./Catalog.module.css"

import Articles from "./articles/Articles"
import Loading from "../loading/Loading"


export default ({param}) => {

    const navigate = useNavigate()
    const { gender, category } = useParams()
    const { isLoading, database } = useIndexedDB()
    const [ articles, setArticles ] = useState()

    const loadCatalog = async(articlesPromise, ...params) => {
        try {
            const articles = await articlesPromise(...params)
            if (articles.length > 0)
                setArticles(articles)
            else throw new Error(`No hay artículos en esta categoría (${param}): ${params ? params.join() : ""}`)
        } catch(e) {
            console.warn(e)
            //navigate("/empty")
            setArticles([])
            /*database.selectAll()
            .then(articles => setArticles(articles))
            */
        }
    }

    const showArticle = id => navigate(`/product/${id}`)

    //useEffect(() => { console.log("Showing:", articles) }, [articles])

    useEffect(() => {
        switch(param) {
            case 'home': { loadCatalog(database.selectAll); break; }
            case 'promos': { loadCatalog(database.selectDiscounts); break; }
            case 'recent': { loadCatalog(database.selectRecent); break; }
            default: { loadCatalog(database.selectArticlesOfCategoryOfGender, gender, category) } // categories
        }
    }, [param, category])

    return <>

    <div className={`${styles.subtitlecontainer} unselectable`}>
        <p className={`${styles.subtitle}`}> {catalog[param] ? catalog[param].title : category} </p>
        { articles && articles.length > 0 ? <p className={`${styles.amount}`}> {articles.length} productos </p> : <></> }
    </div>

    { articles && isLoading === false ? 
        (
            articles.length > 0 ?
                <Articles articles={articles} onArticleSelect={showArticle}/>
                :
                <p className={styles.empty}>Aún no hay nada por acá</p>
        )
        :
        <Loading/>
    }

    </>
}