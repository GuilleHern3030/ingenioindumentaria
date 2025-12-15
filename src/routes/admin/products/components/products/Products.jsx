import { useState, useEffect } from 'react'
import styles from './Products.module.css'
import StringUtils from '@/utils/StringUtils'

import contractIcon from '@/assets/icons/cross.webp'

import Product from '../product/Product'

import { request } from '@/api'
import { count, selectByCategory } from '@/api/products'

import Reload from "../../../components/reload/Reload"
import Loading from "@/components/loading/LogoLoading"

export default ({slug, title, onProductSelected, t}) => {

    const [ products, setProducts ] = useState(true)
    const [ contracted, setContracted ] = useState(true)
    const [ networkError, setNetworkError ] = useState(false)
    const [ size, setSize ] = useState()
    const [ cascadeSize, setCascadeSize ] = useState()
    const [ isLoading, setIsLoading ] = useState()
    const [ error, setError ] = useState()

    useEffect(() => { 
        setSize(undefined)
        setCascadeSize(undefined)
        request(setIsLoading, setError, count, true, slug, false)
        .then(size => setSize(size))
        setContracted(true)
        if (slug?.length > 0) 
            request(setIsLoading, setError, count, true, slug, true)
                .then(size => setCascadeSize(size))
    }, [slug])

    const loadProductsFromCategory = (slug) => {
        request(setIsLoading, setError, selectByCategory, slug, true)
        .then(products => {
            setProducts(slug?.length > 0 || products.length > 0 ? products : [])
            setContracted(false)
        }).catch(e => {
            console.error(e)
                if (e?.status() === 503)
                    setNetworkError(true)
        })
    }

    const handleShowProducts = () => {
        setNetworkError(false)
        loadProductsFromCategory(slug)
    }

    return products && <div>
        <div className={styles.title}>
            <div></div>
            <p>{StringUtils.lastSlug(title)}</p>
            <div className={styles.contract}>
                { !contracted && products.length > 0 && <img src={contractIcon} onClick={() => setContracted(true)}/> }
            </div>
        </div>
        { error && <p className='error'>{error}</p> }
        { 
            (isLoading === true) ? <Loading/> :
            networkError ? <Reload onClick={() => handleShowProducts()}/> :
            
            size > 0 && contracted === true ?
                <div className={styles.contracted}>
                    <button 
                        onClick={handleShowProducts}
                        className='button_square_white'>
                            {`${t('contracted_text')} ${size}`}
                    </button>
                </div>
            :
            
            size > 0 && products.length > 0 ?
                <section className={styles.products}>
                    
                    {
                        products.map((article, index) =>
                            <Product key={index} product={article} onProductSelected={onProductSelected} t={t} />
                        )
                    }
                </section> 

            : 

            <p className={styles.empty}>{t('no_products_in_category')}</p>
        }
        { (cascadeSize - size) > 0 &&
            <p className={styles.subproducts}>{`${t('subcategories_products')} ${cascadeSize - size}`}</p>
        }
    </div>
}