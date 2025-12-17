import { useEffect, useState } from 'react'
import { useParams, useNavigate, replace } from 'react-router-dom'

import styles from './Article.module.css'

import Article from '@/api/products'

import { useRouteI18n } from '@/hooks/useRouteI18N'
import useDataBase from '@/hooks/useDataBase'
import { getParams as getQueryParams } from '@/hooks/useParams'
import useClientInfo from '@/hooks/useClientInfo'

import IdUtils from '@/utils/IdUtils'

import Loading from '@/components/loading/LogoLoading'

import Images from './components/images/Images'
import Slug from './components/slug/Slug'
import Name from './components/name/Name'
import Price from './components/price/Price'
import Filter from './components/filter/Filter'
import Filters, { parseQueryFilters, parseVariantId } from './components/filters/Filters'
import Buy from './components/buy/Buy'
import Error from './components/error/Error'

export default () => {

    const { t, ready } = useRouteI18n('main/article')
    const { dataLoaded, contactlink, fees } = useClientInfo()

    const { "*": index } = useParams() // obtiene todo el param
    const navigate = useNavigate()

    const [ article, setArticle ] = useState()
    const [ variant, setVariant ] = useState()
    const [ categories, setCategories ] = useState()
    const [ filters, setFilters ] = useState({})

    const [ code, setCode ] = useState()

    const { getArticle, isLoading, error } = useDataBase()

    useEffect(() => {

        try {

            const { slug, id, variantId } = IdUtils.parse(index)
            console.log(IdUtils.parse(index))

            if (id) {

                console.clear()

                getArticle(id).then(rawArticle => {
                    const article = new Article(rawArticle)
                    const variant = article.selectVariant(variantId)
                    setArticle(article)
                    setVariant(variant)
                    setCategories(article.slugs())
                    setFilters(!variant ? parseQueryFilters(article, getQueryParams()) : parseVariantId(article, variantId))
                    console.log("%cARTICLE", "color:blue; background:pink; padding:4px; border:1px solid blue;", article.toJson())
                }).catch(e => { 
                    console.error(e)
                    setArticle(null)
                })

            } else navigate(
                '/category' + (slug ? `/${slug}` : ''), 
                { replace:true }
            )

        } catch(e) { navigate('/category', { replace:true }) }

    }, [index])

    useEffect(() => {
        setCode(`${IdUtils.id(index)}${variant?.id() ?? ''}`)
    }, [variant])

    const handleAddCart = (article, variant) => {

    }

    const handleBuy = (article, variant) => {

    }

    const handleConsult = (article, variant) => {
        const { id, slug } = IdUtils.parse(index)
        const url = IdUtils.url(id, slug, variant?.id)
        const fullUrl = window.location.href
        const link = encodeURIComponent(url)
        window.open(contactlink + `?text=${t('consult_message')}: \n\r` + link, "_blank")
    }

    const handleFavouriteChange = () => {

    }

    return <main>

        { (!ready || !dataLoaded || isLoading) && <Loading/> }

        { article && 
            <section className={styles.datasection}>

                <Images images={variant?.images().length > 0 ? variant.images() : article.images()} />

                <article className={styles.information}>

                    <Slug code={code} index={index}/>

                    {/* Nombre y botón para agregar artículo a favoritos */}
                    <Name 
                        id={article.id()} 
                        name={article.name()}
                        onFavouriteChange={handleFavouriteChange}
                    /> 

                    <Price 
                        price={variant?.price() ?? article.price()} 
                        discount={variant?.discount() ?? article.discount()}
                        fees={fees}
                        t={t}
                    />

                    <p className={styles.description}>{variant?.description() ?? article.description()}</p>

                    <Filters
                        article={article}
                        categories={categories}
                        filters={filters}
                        setFilters={setFilters}
                        onVariantChange={setVariant}
                    />

                    <Buy
                        article={article?.toJson()}
                        variant={variant?.toJson()}
                        onBuy={handleBuy}
                        onAddShoppingCart={handleAddCart}
                        onConsult={handleConsult}
                        t={t}
                    />
                    
                </article>
            </section>
        }

        { article === null && <Error t={t}/> }

    </main>
}