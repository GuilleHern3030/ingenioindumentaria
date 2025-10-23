import { useState, useEffect, useRef } from 'react'
import useIndexedDB from '../../../../hooks/useIndexedDB'
import Loading from '../../../loading/Loading'
import Products from './products/Products'
import useArticleFilter from '../../../../hooks/useArticleFilter'

export default () => {
    
    const { genderSelected, categorySelected, setCategorySelected, setCategoriesToShow, categoriesToShow } = useArticleFilter()
    
    const { isLoading, database } = useIndexedDB()
    
    const [ isCreating, setIsCreating ] = useState(false)
    const [ warning, setWarning ] = useState()

    const input = useRef()

    const createCategory = categoryName => {
        if (categoryName) {
            database.putCategoryOfGender(genderSelected, categoryName)
            .then(() => database.selectCategoriesOfGender(genderSelected))
            .then(categories => {
                if (categories)
                    setCategoriesToShow([...categories])
            })
        } else setWarning("La categoría no puede estar vacía")
    }

    useEffect( () => {
        setIsCreating(false)
        setCategoriesToShow(undefined)
        database.selectCategoriesOfGender(genderSelected)
        .then(categories => {
            if (categories)
                setCategoriesToShow([...categories])
        })
    }, [genderSelected])

    useEffect(() => {
        setIsCreating(false)
    }, [categorySelected])

    return <> 
    
            { isLoading !== false ? <Loading/> :
                categoriesToShow && categoriesToShow.length > 0 ?
                    <div className={'options'}>
                        {
                            categoriesToShow.map((category, index) => 
                                <p 
                                    key={index} 
                                    className={category == categorySelected ? 'selected' : 'option'} 
                                    onClick={() => setCategorySelected(prevCategory => category == prevCategory ? undefined : category)}
                                >{category}</p>
                                
                            )
                        }
                    </div>
                : 
                <></>
            }
            
            { isLoading !== false ? <></> :

                isCreating === true ? <div className='creating-div center'>
                    <p>Escriba el nombre de la categoría</p>
                    <p className='red'>{warning}</p>
                    <input ref={input} className='input'/>
                    <button className='create-button' onClick={() => createCategory(input.current.value)}>CREAR</button>
                </div>

                :

                categorySelected ? 

                    <Products/> 

                    : 

                    <div className='emptylist center'>
                        <p className='instruction'>Seleccione una categoría o cree una</p>
                        <button className='create-button' onClick={() => setIsCreating(true)}>CREAR CATEGORÍA</button>
                    </div>
            }
    
    
        </>

}