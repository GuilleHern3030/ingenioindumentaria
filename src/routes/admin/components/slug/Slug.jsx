import { useState, useEffect, useLayoutEffect } from 'react'
import styles from './Slug.module.css'

import Slug from '@/components/slug/Slug.jsx'
import { getParams } from "@/hooks/useParams"
import { get } from '@/api/categories'

const getName = (slug) => slug.split('/').pop()

export default ({onSlugChange=(slug)=>{}, onCategoriesLoaded=()=>{}, onError=()=>{}, hideSubcategories=false, params=false}) => {

    const [ categories, setCategories ] = useState()
    const [ listedSlugs, setListedSlugs ] = useState()
    const [ slugSelected, setSlugSelected ] = useState()

    useEffect(() => {
        if (hideSubcategories === false) {
            get(true)
            .then(categories => {
                setCategories(categories)
                onCategoriesLoaded(categories)
                const { slug } = getParams()
                if (params && slug) handleSlugClick(slug, categories)
                else setListedSlugs(categories.children())
            }).catch(e => { onError(e) })
        }
    }, [])

    const handleSlugClick = (slug, allCategories=categories) => {
        if (allCategories) {
            const listedSlugs = slug ? 
                allCategories.slugChildren(slug) :
                allCategories.children()
            setSlugSelected(slug)
            setListedSlugs(listedSlugs)
            onSlugChange(slug ? slug.toLowerCase() : '', listedSlugs)
        }
    }

    return <>
        <Slug className={styles.slug} slug={slugSelected} onParentClick={handleSlugClick} onSelfClick={() => {}}/>
        { hideSubcategories === false && <SlugChildren slugs={listedSlugs} onClick={handleSlugClick}/> }
    </>

}

const SlugChildren = ({slugs, category, onClick}) => {
    
    const [ slug, setSlug ] = useState()

    const handleCategoryClick = categorySelected => {
        onClick(categorySelected)
    }

    useEffect(() => {
        if (slugs) {
            const routes = slugs.map((slug, index) => <div className="flex-center" key={index}>
                <p
                    className={`${styles.route}`}
                    onClick={() => handleCategoryClick(slug)}
                    >{getName(slug).toLowerCase()} 
                </p>
                { index < slugs.length - 1  && <p className={styles.separator}>-</p> }
            </div>
            )

            setSlug(routes)

        } else setSlug()
    }, [slugs])

    return <div className={`${styles.routes} ${styles.slug}`}>
        <p className={styles.symbol}>{'>'}</p>
            {slug}
        </div>

}