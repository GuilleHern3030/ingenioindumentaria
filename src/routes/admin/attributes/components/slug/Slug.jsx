import { useState, useEffect, useLayoutEffect } from 'react'
import styles from './Slug.module.css'

import { getParams } from "@/hooks/useParams"

const getName = (slug) => slug.split('/').pop().replace("-", " ")

const getChildren = (categories, slug) => {
    const depth = (slug) => (slug?.match(/\//g) || []).length
    const children = categories.filter(category => !slug ? !category.slug.includes('/') : category.slug.startsWith(slug) && depth(category.slug) == depth(slug) + 1)
    return children.map(category => category.slug)
}

export default ({ categories, onSlugChange, showChildren = true }) => {

    const [ listedSlugs, setListedSlugs ] = useState()
    const [ slugSelected, setSlugSelected ] = useState()

    useEffect(() => {
        if (categories) {
            const { slug } = getParams()
            if (slug) handleSlugClick(slug)
            else setListedSlugs(getChildren(categories))
        }
    }, [ categories ])

    const handleSlugClick = (slug) => {
        setSlugSelected(slug)
        setListedSlugs(getChildren(categories, slug))
        onSlugChange && onSlugChange(slug ? slug.toLowerCase() : '', listedSlugs)
    }

    return <>
        <Slug slug={slugSelected} onParentClick={handleSlugClick} onSelfClick={() => {}}/>
        { showChildren && <SlugChildren slugs={listedSlugs} onClick={handleSlugClick}/> }
    </>

}

const Slug = ({ slug, onParentClick=()=>{}, onSelfClick=()=>{} }) => {

    const [ routes, setRoutes] = useState()

    useEffect(() => {
        if (slug) {
            const slugs = slug.split("/");
            const slugged = slugs.map((_, i) => slugs.slice(0, i + 1).join("/"));
            const routes = slugs.map((slug, index) => <div className="flex-center" key={index}>
                <p className={styles.slash} >/</p>
                <p
                    className={styles.route} 
                    id={`${slugged[index]}-${index}/${slugs.length}`}
                    onClick={(slugs.length !== (index+1)) ? () => onParentClick(slugged[index]) : () => onSelfClick(slugged[index])}
                    >{slug.toLowerCase().replace("-", " ")} 
                </p>
            </div>
            )

            setRoutes(routes)

        } else setRoutes()
    }, [slug])

    return <div className={`${styles.routes} ${styles.slug}`}>
        <p className={styles.route} onClick={() => onParentClick()}>{"index"}</p>
        {routes}
    </div>

}

const SlugChildren = ({ slugs, onClick }) => {
    
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
                    >{ getName(slug).toLowerCase() } 
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