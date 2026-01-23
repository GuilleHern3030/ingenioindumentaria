import { useEffect, useState } from 'react'
import { useOutletContext } from "react-router-dom";

import { selectAll } from '@/api/categories.ts'
import { request } from '@/api'

import styles from './Index.module.css'

// Components
import Slug from '../components/Slug.jsx'
import CategoriesList from '../components/CategoriesList.jsx'
import CreateCategory from '../components/CreateCategory.jsx'
import DeleteCategory from '../components/DeleteCategory.jsx'
import EnableCategory from '../components/EnableCategory.jsx'
import MoveCategory from '../components/MoveCategory.jsx'
import Attributes from '../components/Attributes.jsx'

import Loading from '@/components/loading/Loading.jsx'
import Reload from '../../components/reload/Reload.jsx'

import CategoryUtils from '../utils/CategoryUtils';

export default () => {
    
    const { t } = useOutletContext()

    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()
    const [ networkError, setNetworkError ] = useState(false)
    const [ categories, setCategories ] = useState()
    const [ listedCategories, setListedCategories ] = useState()
    const [ categorySelected, setCategorySelected ] = useState()
    const [ categorySelectedToMove, setCategorySelectedToMove ] = useState()

    const loadCategories = (callback) => {
        request(setIsLoading, setError, selectAll, true)
        .then(treeOfCategories => {
            setCategories(treeOfCategories)
            setListedCategories(treeOfCategories)
            callback && callback(treeOfCategories)
        })
        .catch(e => {
            console.error(e)
            if (e?.isNetworkError())
                setNetworkError(true)
        })
    }

    useEffect(() => { loadCategories() }, [])

    const handleCategoryClick = (category) => {
        if (category) {
            category.name = CategoryUtils.name(category)
            if (category && category.slug.startsWith(categorySelectedToMove?.slug)) { // category is child of categorySelectedToMove
                setError(t('couldnt_move_inside_self'))
                return;
            } else if (categorySelectedToMove) setError()
            setCategorySelected(category)
            setListedCategories(category.children)
        }
        else {
            setCategorySelected(category)
            setListedCategories(categories)
        }
    }

    const handleOnCategoriesEdited = (category) => {
        loadCategories((treeOfCategories) => {
            setCategorySelectedToMove(undefined)
            handleCategoryClick(CategoryUtils.find(treeOfCategories, category.slug))
        })
    }

    const handleOnSelectToMove = (category) => {
        if (!category) setError()
        setCategorySelectedToMove(category)
        handleCategoryClick()
    }

    return <>
        <p className={styles.title}>{t('title')}</p>
        {
            (isLoading === true) ? <Loading /> :
            <>
                <Slug categories={categories} category={categorySelected} onClick={handleCategoryClick} onEdit={handleOnCategoriesEdited} canEdit={true} t={t} />
                {categorySelectedToMove && <p className='green'>{`${t('instruction_movement')} ${categorySelectedToMove.name}`}</p>}
                {error && <p className='error'>{error}</p>}
                {categorySelected && <p className={styles.category}>{categorySelected?.name}</p>}
                {!categorySelected && !categorySelectedToMove && 
                    <section className={styles.instructions}>
                        <p className={styles.instruction}>{t('instruction_1')}</p>
                        <p className={styles.instruction}>{t('instruction_2')}</p>
                    </section>
                }
                <hr />
                {categorySelected && <p className={styles.subtitle}>{t('subcategories')}</p>}
                <CategoriesList parent={categorySelected} options={listedCategories} onClick={handleCategoryClick} t={t} />
                { !networkError && !categorySelectedToMove && <CreateCategory parent={categorySelected} onCreate={handleOnCategoriesEdited} t={t} />}
                <hr />
                { !networkError ? 
                    <>
                        {categories && !categorySelectedToMove && <Attributes categories={categories} category={categorySelected} t={t} />}
                        {categorySelected && !categorySelectedToMove && categorySelected.disabled && <EnableCategory category={categorySelected} t={t} />}
                        {categorySelected && !categorySelectedToMove && <DeleteCategory category={categorySelected} t={t} />}
                        {categories && <MoveCategory categorySelected={categorySelectedToMove} category={categorySelected} onSelect={handleOnSelectToMove} t={t} />}
                    </> : <Reload/>
                }

            </>
        }



    </>

}