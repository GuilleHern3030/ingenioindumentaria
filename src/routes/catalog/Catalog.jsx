import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'

import useIndexedDB from "../../hooks/useIndexedDB"

import catalog from "./Catalog.json"
import styles from "./Catalog.module.css"

import Articles from "../../components/articles/Articles"
import Loading from "../../components/loading/Loading"


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
            else throw new Error("No hay artículos en esa categoría")
        } catch(e) {
            console.warn(e)
            database.selectAll()
            .then(articles => setArticles(articles))
        }
    }

    const showArticle = id => navigate(`/product/${id}`)

    useEffect(() => {
        console.log("Showing:", articles)
    }, [articles])

    useEffect(() => {
        switch(param) {
            case 'promos': { loadCatalog(database.selectRecent); break; }
            case 'recent': { loadCatalog(database.selectRecent); break; }
            default: { loadCatalog(database.selectArticlesOfCategoryOfGender, gender, category) } // categories
        }
    }, [param, category])

    return <>
    <div className={`${styles.subtitlecontainer} unselectable`}>
        <p className={`${styles.subtitle}`}> {catalog[param] ? catalog[param].title : category} </p>
        { articles ? <p className={`${styles.amount}`}> {articles.length} productos </p> : <></> }
    </div>

    { articles && isLoading === false ? 
        <Articles articles={articles} onArticleSelect={showArticle}/> :
        <Loading/>
    }

    </>
}