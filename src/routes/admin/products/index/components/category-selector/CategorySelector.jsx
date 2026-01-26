import { useState, useEffect } from 'react'

import styles from './CategorySelector.module.css'
import { Navigate, useNavigate } from 'react-router-dom'
import Loading from '@/components/loading/Loading'

export default ({ categories, products, onSelect, t }) => {

    const navigate = useNavigate()

    const [ spinnerDeployed, setSpinnerDeployed ] = useState(null)

    const handleSelection = (slug) => {
        setSpinnerDeployed(false)
        onSelect(slug)
    }

    return <>
        <section className={styles.instructions}>
            <p className={styles.instruction}>{ t('instruction_1') }</p>
            <p className={styles.instruction}>{ t('instruction_2') }</p>
            <p className={styles.instruction}>{ t('instruction_3') }</p>
            <p className={styles.instruction}>{ t('instruction_4') }</p>
        </section>

        <hr/>

        <section className={styles.section}>

            <div className={styles.spinner} onClick={() => setSpinnerDeployed(prev => !prev)}>
                <p className={styles.text}>{t('select_category')}</p>
                <p className={spinnerDeployed ? styles.symbol_active : styles.symbol_inactive}>&#10095;</p>
            </div>

            <Spinner
                deployed={spinnerDeployed}
                categories={categories}
                products={products}
                onSelect={handleSelection}
                t={t}
            />

        </section>
    </>

}

const Spinner = ({ deployed, products, categories, category, onSelect, t }) => {

    const [ slug, setSlug ] = useState('')

    useEffect(() => { setSlug('') }, [ deployed ])

    const children = (slug) => {
        if (slug.length > 0) {

            const recursiveChildren = (categories, slug, base = []) => {

                const prevSlug = base.slice()
                prevSlug.pop()

                if (slug?.length == 0) {
                    const slugs = Object.keys(categories)

                    if (slugs.length == 0)
                        return onSelect(base.join('/'))

                    const elements = Object.keys(categories).map((category, key) => {
                        const uri = (base.join('/') + '/' + category)
                        const categoryObject = products?.categorized?.find(category => category.slug == uri)
                        const count = categoryObject?.products.length
                        console.log(uri)
                        return <SpinnerItem 
                            key={key} 
                            onClick={() => setSlug(uri)}
                            count={count}
                            disabled={categoryObject?.disabled === true}
                        >{category.replaceAll('-', " ")} </SpinnerItem>
                    })

                    elements.push(<p
                        key={elements.length + 1}
                        className={styles.back}
                        onClick={() => { setSlug(prevSlug.join('/').length > 0 ? prevSlug.join('/') : '') }}
                    >&#10094;<span>{t('back')}</span></p>)

                    elements.unshift(<hr className={styles.hr} key={elements.length + 1}/>)
                    elements.unshift(<p
                        key={elements.length + 1}
                        className={styles.list_item_title}
                        onClick={() => { onSelect(base.join('/')) }}
                    >{base.slice().pop()}</p>)

                    return elements
                }

                const parent = slug.shift()
                base.push(parent)

                return recursiveChildren(categories[parent], slug, base)
            }

            return recursiveChildren(categories, slug.split("/"))
            
        } else return [ 
            ...Object.keys(categories).map((category, key) => { 
                const categoryObject = products?.categorized?.find(categoryObj => categoryObj.slug == category)
                const count = categoryObject?.products.length
                return <SpinnerItem 
                    key={key+1} 
                    onClick={() => setSlug(category)}
                    count={count}
                    disabled={categoryObject?.disabled === true}
                    >{category.replaceAll('-', " ")}
                </SpinnerItem>
            }), 
            <SpinnerItem onClick={() => onSelect(null)} key={0} count={products?.uncategorized?.length}>{t('uncategorized')}</SpinnerItem>
        ]
    }

    return deployed != null && 
        <div className={`${styles.list} ${deployed ? styles.list_active : styles.list_inactive }`}>
            { children(slug) ?? <Loading/> }
        </div>
}

const SpinnerItem = ({ onClick, children, count, disabled }) => 
    <div className={styles.list_item} onClick={onClick}>
        <p className={disabled ? styles.list_item_disabled : styles.list_item_enabled}> { children } </p>
        { count != undefined && <p className={disabled || count === 0 ? styles.list_item_disabled : styles.list_item_enabled}>{(count)}</p> }
    </div>