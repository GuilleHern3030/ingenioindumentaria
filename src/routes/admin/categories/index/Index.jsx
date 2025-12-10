import { useEffect, useState } from 'react'
import { useOutletContext } from "react-router-dom";

import { selectAll } from '@/api/categories.ts'
import { request } from '@/api'

import styles from './Index.module.css'

// Components
import Categories from '../components/Categories.jsx'
import Slug from '../components/Slug.jsx'
import CreateCategory from '../components/CreateCategory.jsx'
import DeleteCategory from '../components/DeleteCategory.jsx'
import EnableCategory from '../components/EnableCategory.jsx'
import MoveCategory from '../components/MoveCategory.jsx'
import Attributes from '../components/Attributes.jsx'

import Loading from '@/components/loading/Loading.jsx'
import Reload from '../../components/reload/Reload.jsx'

export default () => {
    
    const { t } = useOutletContext();

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    const [networkError, setNetworkError] = useState(false)
    const [categories, setCategories] = useState()
    const [listedCategories, setListedCategories] = useState()
    const [categorySelected, setCategorySelected] = useState()
    const [categorySelectedToMove, setCategorySelectedToMove] = useState()

    useEffect(() => {
        request(setIsLoading, setError, selectAll, true)
        .then(categories => {
            setCategories(categories)
            const mainCategories = categories.mainCategories()
            setListedCategories(mainCategories)
        })
        .catch(e => {
            console.error(e)
            if (e?.isNetworkError())
                setNetworkError(true)
        })
    }, [])

    const handleCategoryClick = (category) => {
        if (category) {
            if (category && category.isChildOf(categorySelectedToMove)) {
                setError(t('couldnt_move_inside_self'))
                return;
            } else if (categorySelectedToMove) setError()
            setCategorySelected(category)
            setListedCategories(category.children())
        }
        else {
            setCategorySelected(category)
            const mainCategories = categories.mainCategories()
            setListedCategories(mainCategories)
        }
    }

    const handleOnCategoriesEdited = (category) => {
        request(setIsLoading, setError, selectAll, true)
        .then(categories => {
            setCategories(categories)
            setCategorySelectedToMove(undefined)
            handleCategoryClick(category)
        })
        .catch(e => {
            console.error(e)
            if (e?.isNetworkError())
                setNetworkError(true)
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
                {categorySelectedToMove && <p className='green'>{`${t('instruction_movement')} ${categorySelectedToMove.name()}`}</p>}
                {error && <p className='error'>{error}</p>}
                {categorySelected && <p className={styles.category}>{categorySelected?.name()}</p>}
                {!categorySelected && !categorySelectedToMove && 
                    <section className={styles.instructions}>
                        <p className={styles.instruction}>{t('instruction_1')}</p>
                        <p className={styles.instruction}>{t('instruction_2')}</p>
                    </section>
                }
                <hr />
                {categorySelected && <p className={styles.subtitle}>{t('subcategories')}</p>}
                <Categories parent={categorySelected} options={listedCategories} onClick={handleCategoryClick} t={t} />
                <hr />
                { !networkError ? <>
                        {!categorySelectedToMove && <CreateCategory parent={categorySelected} onCreate={handleOnCategoriesEdited} t={t} />}
                        {categorySelected && !categorySelectedToMove && categorySelected.isActive() == false && <EnableCategory category={categorySelected} t={t} />}
                        {categorySelected && !categorySelectedToMove && <DeleteCategory category={categorySelected} t={t} />}
                        {categories && <MoveCategory categorySelected={categorySelectedToMove} category={categorySelected} onSelect={handleOnSelectToMove} t={t} />}
                        {categories && !categorySelectedToMove && categorySelected && <Attributes category={categorySelected} t={t} />}
                    </> : <Reload/>
                }

            </>
        }



    </>

}