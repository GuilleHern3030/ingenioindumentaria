import { useEffect, useState } from 'react'

import styles from './Products.module.css'

import { selectByCategory } from "@/api/products"
import { request } from "@/api";
import Product from './Product.tsx';
import Loading from '@/components/loading/Loading';

export default ({ categories, category, onSelect, onCreate, onBack, t }) => {

    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()

    const [ products, setProducts ] = useState()

    useEffect(() => {

        console.log(categories)

        request(setIsLoading, setError, selectByCategory, category)
        .then(response => {
            console.log(response)
            setProducts(response)
        })
        .catch(e => {
            console.error(e)
            /*if (e?.isNetworkError())
                setNetworkError(true)*/
        })

    }, [ category ])

    return <>
        <p className={styles.title}>{category ? category.replaceAll("/", " / ").replaceAll("-", " ") : t('uncategorized')}</p>

        <section className={styles.products}>
            {
                isLoading || products === undefined ? <Loading/> :
                error ? <p className='error'>{error}</p> :
                products?.length > 0 ? products.map((product, index) => <Product key={index} product={product} onSelect={onSelect} t={t}/>) :
                <p className={styles.empty}>{t('no_products_in_category')}</p>
            }
        </section>

        { !isLoading && !error && 
            <div className={styles.button}>
                <button onClick={onCreate} className='button_square_white'>{t('create')}</button>
            </div>
        }

        <div className={styles.button}>
            <button onClick={onBack} className='button_square_white'>{t('back')}</button>
        </div>
    </>

}