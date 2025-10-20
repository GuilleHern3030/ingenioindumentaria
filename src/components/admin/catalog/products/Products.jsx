import { useEffect, useState } from "react";

// Styles
import styles from "./Product.module.css"

// Components
import Product from "./Product";
import ProductEditor from "./ProductEditor";
import Loading from "../../../loading/Loading.jsx";

// Hooks
import useIndexedDB from "../../../../hooks/useIndexedDB";

// Images
import add from '../../../../assets/icons/add.png'

// API functions
import { 
    post as createArticle,
    put as editArticle,
    delete as deleteArticle
} from '../../../../api/articles.ts'
import { 
    deleteAll as deleteImages,
    uploadAll as uploadImages
} from '../../../../api/images.ts'

const goTop = () => window.scrollTo({top:0});

const removeArticle = async(article) => {

    console.log("Removing: ", article)

    console.log("Removing images ", article.images())
    const results = await deleteImages(article.images(), article)
    console.log("Remove images result: ", results)

    console.log("Removing article ", article.name())
    const result = deleteArticle(article)
    console.log("Remove result: ", result)

}

const putArticle = async(article, addedImages=[], removedImages=[]) => {

    //console.log("Editing: ", article)

    if (addedImages.length > 0) {
        //console.log("Uploading ", addedImages)
        const results = await uploadImages(addedImages, article)
        //console.log("Upload images result: ", results)
    }

    if (removedImages.length > 0) {
        //console.log("Removing ", removedImages)
        const results = await deleteImages(removedImages, article)
        //console.log("Remove images result: ", results)
    }

    //console.log("Editing article ", article)
    const result = await editArticle(article)
    //console.log("Edition result: ", result)
}

const postArticle = async(article, addedImages=[]) => {

    console.log("Creating: ", article)

    console.log("Uploading ", addedImages)
    const results = await uploadImages(addedImages, article)
    console.log("Upload images result: ", results)

    console.log("Creating article ", article.name())
    const result = await createArticle(article)
    console.log("Creation result: ", result)

}

export default function({category, deselectCategory, reload}) {

    const [ isLoading, setIsLoading ] = useState(false)
    const [ articleSelected, setArticleSelected ] = useState()
    const [ articles, setArticles ] = useState()
    const { database } = useIndexedDB()
    
    const actualizeList = async(category) => {
        setIsLoading(true)
        const articles = await database.selectByCategory(category)
        setArticleSelected(undefined)
        setArticles(articles)
        setIsLoading(false)
    }

    const onDeleteArticle = article => {
        setIsLoading(true)
        removeArticle(article)
            .then(() => {
                alert("Artículo borrado")
                reload()
            })
            .catch(message => {
                alert(message)
            })
    }

    const onEditArticle = (article, addedImages=[], removedImages=[]) => {
        setIsLoading(true)
        putArticle(article, addedImages, removedImages)
            .then(result => {
                alert("Artículo editado")
                reload()
            })
            .catch(message => {
                alert(message)
            })
    }

    const onCreateArticle = (article, addedImages=[]) => {
        setIsLoading(true)
        postArticle(article, addedImages)
            .then(() => {
                alert("Artículo creado")
                reload()
            })
            .catch(message => {
                alert(message)
            })
    }

    useEffect(() => { actualizeList(category) }, [category])

    const onCancelEditArticle = (...props) => {
        setArticleSelected(undefined)
    }

    return <> 

        { (category || articleSelected) ? <></> : 
        <>
            <p className={styles.productsempty}>Seleccione una categoría o cree una</p> 
            <div className={styles.addcontainer}>
                <img className={styles.add} src={add} onClick={() => {
                    //goTop()
                    database.maxId().then(maxId => {
                        setArticleSelected(maxId + 1)
                    })
                }}/>
            </div>
        </>
        }

        { articles ? articles.map((article, index) => articleSelected === article ? 
            <ProductEditor 
                key={index} 
                index={index} 
                article={article} 
                onAccept={onEditArticle} 
                onCancel={onCancelEditArticle}
                onDelete={onDeleteArticle} 
                id={article.id()}
            /> 
            : 
            <Product 
                key={index} 
                index={index} 
                article={article} 
                onClick={setArticleSelected}
            />
        ) : null }
        
        { 
            typeof(articleSelected) === 'number' ?
            <div className={styles.producteditorfloating}>
                <div>
                    <p>Creando nuevo artículo</p>
                    <ProductEditor
                        id
                        onAccept={onCreateArticle}
                        onCancel={onCancelEditArticle}
                        onDelete={onCancelEditArticle}
                    />
                </div>
            </div> : <></>
        }

        {
            isLoading !== true ? <></> :
            <div className={styles.loading}>
                <Loading/>
            </div>
        }

        </>
    

}