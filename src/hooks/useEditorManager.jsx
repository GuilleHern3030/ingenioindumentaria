import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const indexOf = (articles, id) => {
    for (let index = 0; index < articles.length; index++) {
        if (Number(articles[index].id()) == Number(id)) {
            return index;
        }
    }
}

export default function() {

    const { articlesEdited, setArticlesEdited } = useContext(AdminContext)

    const getEditions = () => articlesEdited.slice()

    /**
     * Aplica las ediciones / adiciones a una lista de artículos de una misma categoría
     * @param {string} category nombre de la categoría
     * @param {Array<Article>} articles Lista de artículos de una misma categoría que debe actualizarse
     * @param {Array<Article>} allArticlesEdited Lista de todas las ediciones / adiciones (puede haber categorías mezcladas)
     * @returns 
     */
    const applyEditions = (category, articles, allArticlesEdited=articlesEdited) => {
        //if (!articles || !category) return [];

        const articlesMapped = []

        for (let i = 0; i < allArticlesEdited.length; i++) {
            const articleEdited = allArticlesEdited[i]
            if (articleEdited.category() === category) 
                articlesMapped.push(articleEdited)
        }

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i]
            if (article.category() === category) {
                const index = indexOf(allArticlesEdited, article.id())
                if (index == undefined) // el artículo no está editado
                    articlesMapped.push(article) 
            }
        }

        return articlesMapped.filter(article => !article.isRemoved())
    }
    
    // Añade el artículo editado a la lista de artículos editados
    // Si el artículo ya se encuentra en la lista (ID), se modifica
    const addEdition = article => {
        const newArticlesEdited = articlesEdited.slice()
        const index = indexOf(articlesEdited, article.id())
        if (index != undefined) newArticlesEdited.splice(index, 1, article) // El articulo ya está editado
        else newArticlesEdited.push(article)
        setArticlesEdited(newArticlesEdited)
        return newArticlesEdited
    }

    return {
        addEdition,
        applyEditions,
        getEditions
    }

}