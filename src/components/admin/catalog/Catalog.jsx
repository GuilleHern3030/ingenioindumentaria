import { useEffect, useState } from 'react'
import useIndexedDB from '../../../hooks/useIndexedDB'
import styles from './Catalog.module.css'

import Loading from '../../loading/Loading'
import Products from './products/Products'

const showCategories = (categories, setCategorySelected, categorySelected) => {
    if (!categories) return <p>Cargando categorías...</p>
    const categoriesJsx = []
    categories.forEach((category, index) => 
        categoriesJsx.push(<p key={index} index={index} className={`${styles.category} ${categorySelected === category ? styles.categorySelected : ""}`} onClick={() => setCategorySelected(category)}> {category} </p>)
    )
    return categoriesJsx;
}

export default function({reload}) {

    const [ categories, setCategories ] = useState([])
    const [ categorySelected, setCategorySelected ] = useState()
    
    const { isLoading, database } = useIndexedDB()

    const handleCategorySelect = category => {
        setCategorySelected(categorySelected => categorySelected === category ? undefined : category)
    }

    const handleCategorySelection = category => {
        if (!categories.includes(category)) {
            setCategories(categories => {
                const newCategories = categories.slice()
                newCategories.push(category)
                return newCategories
            })
        } 
        else if (category !== categorySelected)
            setCategorySelected(category)
    }

    useEffect(() => {
        database.selectCategories().then(categories => {
            setCategories(categories) 
        })
    }, [])

    return <>
        <div className={styles.categories}>
            {showCategories(categories, handleCategorySelect, categorySelected)}
        </div>
        <div className={styles.articles}>
            { 
                isLoading === true ? <Loading/> : 
                <Products category={categorySelected} reload={reload}/>
            }
        </div>
    </>

}