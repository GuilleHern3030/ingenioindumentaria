import { useState, useEffect } from 'react'
import useIndexedDB from '../../../../../hooks/useIndexedDB'
import useArticleFilter from '../../../../../hooks/useArticleFilter'
import Loading from '../../../../loading/Loading'
import styles from './Products.module.css'
import Product from './product/Product'
import ProductEditor from './product/ProductEditor'

export default () => {
    
    const [ articles, setArticles ] = useState()
    const [ isCreating, setIsCreating ] = useState(false)
    const [ isEditing, setIsEditing ] = useState(false)
    
    const { genderSelected, categorySelected } = useArticleFilter()
    
    const { isLoading, database } = useIndexedDB()

    const setEditingId = (id) => {
        console.log(id)
        if (id) {
            setIsCreating(false)
            setIsEditing(id)
        } else if(id === null) {
            setIsCreating(false)
            setIsEditing(false)
        } else database.maxId().then(id => { 
            setIsCreating(id + 1) 
            setIsEditing(false)
        })
    }
    
    useEffect( () => {
        database.selectArticlesOfCategoryOfGender(genderSelected, categorySelected)
        .then(articles => {
            console.log(articles)
            setArticles(articles)
        })
    }, [categorySelected, genderSelected]);


    return <> 
    
            { isLoading !== false ? <Loading/> : <>

                { isCreating === false ?
                    <div className='creating-div center'>
                        <p>Acá podés crear un artículo nuevo o editar uno existente</p>
                        <button className='create-button' style={{margin:'1em'}} onClick={() => setEditingId()}>CREAR</button>
                    </div>
                    :
                    <ProductEditor 
                        id={isCreating} 
                        article={null} 
                        gender={genderSelected} 
                        category={categorySelected}
                    />
                }

                { articles && articles.length > 0 ?
                    <div className={styles.products}>
                        <p className='text-center'>Artículos existentes</p>
                        {
                            articles.map((article, index) => 
                                article.id() !== isEditing ?
                                    <Product key={index} article={article} onEditRequest={() => setEditingId(article.id())}/> :
                                    <ProductEditor key={index} 
                                        article={article} 
                                        id={isEditing} 
                                        gender={genderSelected} 
                                        category={categorySelected}
                                    />
                            )
                        }
                    </div> : <p>Aún no existen artículos en esta categoría</p>
                } </>
            }
    
    
        </>

}