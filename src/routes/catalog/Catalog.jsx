import { useEffect, useState } from "react"
import useIndexedDB from "../../hooks/useIndexedDB"

import catalog from "./Catalog.json"

import Articles from "../../components/articles/Articles"
import Loading from "../../components/loading/Loading"

export default ({filter}) => {

    const { isLoading, database } = useIndexedDB()
    const [ articles, setArticles ] = useState()

    const loadCatalog = async(articlesPromise) => {
        const articles = await articlesPromise()
        if (articles.length > 0)
            setArticles(articles)
        else database.selectAll()
            .then(articles => setArticles(articles))
    }
    useEffect(() => {
        console.log(articles)
    }, [articles])

    useEffect(() => {
        switch(filter) {
            case 'promos': { loadCatalog(database.selectRecent); break; }
            case 'recent': { loadCatalog(database.selectRecent); break; }
            default: {  }
        }
    }, [filter])


    return <>
    <div className="flex-center-column">
        <p style={{fontSize:'2em'}}> {catalog[filter].title} </p>
    </div>

    { articles ? 
        <Articles articles={articles}/> :
        <Loading/>
    }

    </>
}