import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, replace } from 'react-router-dom'

import styles from './Article.module.css'

import { useRouteI18n } from '@/hooks/useRouteI18N'
import { getParams as getQueryParams } from '@/hooks/useParams'
import useClientInfo from '@/hooks/useClientInfo'
import useDataBase from '@/hooks/useDataBase'
import useCart from '@/hooks/useCart'

import IdUtils from '@/utils/IdUtils'

import Loading from '@/components/loading/LogoLoading'

import Images from './components/images/Images'
import Slug from './components/slug/Slug'
import Name from './components/name/Name'
import Price from './components/price/Price'
import Options from './components/options/Options'
import Filters from './components/filters/Filters'
import Buy from './components/buy/Buy'
import Error from './components/error/Error'
import FilterUtils from './utils/FilterUtils'

export default () => {

    const { t, ready } = useRouteI18n('main/article')
    const { dataLoaded, contactlink, fees } = useClientInfo()

    const { "*": index } = useParams() // obtiene todo el param
    const location = useLocation()
    const navigate = useNavigate()

    const [ articleId, setArticleId ] = useState(IdUtils.id(index))
    const [ article, setArticle ] = useState()
    const [ variant, setVariant ] = useState()
    const [ categories, setCategories ] = useState()
    
    const { getArticle, isLoading, error } = useDataBase()
    const cart = useCart()

    useEffect(() => {

        try {

            const { slug, id, variantId } = IdUtils.parse(index)
            /*console.log("Index:", index)
            console.log("ID:", IdUtils.parse(index))
            console.log("From:", location.state?.from)*/

            if (id) {

                getArticle(id).then(article => {

                    article.variants.forEach(variant => variant.name = variant.name ?? article.name )

                    console.log("%cARTICLE", "color:blue; background:pink; padding:4px; border:1px solid blue;", article)
                    
                    const slugs = article.categories?.map(category => category.slug)

                    const queryFilters = FilterUtils.url()
                    console.log("URL-filters", queryFilters)
                    console.log("Variant ID selected:", variantId)

                    const variant = (
                        variantId ? article.variants.find(variant => variant.id == variantId) :
                        queryFilters ? FilterUtils.selectVariant(article.variants, queryFilters) :
                        article.variants[0]
                    ) ?? article.variants[0]
                    
                    console.log("%cVARIANT", "color:blue; background:pink; padding:4px; border:1px solid blue;", variant)

                    setCategories(slugs)
                    setArticle(article)
                    setVariant(variant)

                }).catch(e => { 
                    console.error(e)
                    setArticle(null)
                })

            } else {
                console.warn("No article selected")
                navigate(-1)
            }

        } catch(e) {
            console.warn(e)
            navigate('/category', { replace:true }) 
        }

    }, [ articleId ])

    useEffect(() => {
        const { slug, id, variantId } = IdUtils.parse(index)
        const route = slug ? `/${slug}` : ''
        const code = `${IdUtils.id(index)}${variant?.id ?? ''}`
        navigate(
            `/article${route}/${code}`, 
            { 
                replace: true,
                state: { from: location.state?.from }
            }
        )
    }, [ variant ])

    const handleAddCart = (article, variant, quantity=1) => {
        cart.add(article, quantity, variant)
        .then(() => {
            console.log("added")
        })
        .catch(e => {
            console.error(e)
        })
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

    const handleBack = () => {
        const { slug } = IdUtils.parse(index)
        const from = location.state?.from
        const route = 
            from ? from :
            slug ? `/category/${slug}` :
            `/`
        navigate(
            from ? from :
            slug ? `/category/${slug}` :
            `/`
        )
    }

    const handleSelect = (variant) => {
        document.getElementById("article")?.scrollIntoView({ behavior: "smooth" })
        setVariant(variant)
    }

    return <main>

        { (!ready || !dataLoaded || isLoading) && <Loading/> }

        { article != undefined && 
            <>
            <section className={styles.datasection} id='article'>

                <Images images={variant?.images.length > 0 ? variant.images : article.images} />

                <article className={styles.information}>

                    <Slug 
                        index={index}
                        onBack={handleBack}
                    />

                    {/* Nombre y botón para agregar artículo a favoritos */}
                    <Name 
                        id={article.id} 
                        name={variant?.name ?? article?.name}
                        onFavouriteChange={handleFavouriteChange}
                        
                    /> 

                    <Price 
                        price={variant?.price ?? article.price} 
                        discount={variant?.discount ?? article.discount}
                        fees={fees}
                        t={t}
                    />

                    <p className={styles.description}>{variant?.description ?? article.description}</p>

                    <Filters 
                        variant={variant}
                    />

                    <Buy
                        article={article}
                        variant={variant}
                        onBuy={handleBuy}
                        onAddShoppingCart={handleAddCart}
                        onConsult={handleConsult}
                        onBack={handleBack}
                        t={t}
                    />
                    
                </article>

            </section>
                
            <Options
                article={article}
                variant={variant}
                categories={categories}
                onSelect={handleSelect}
                t={t}
            />
            </>
        }

        { article === null && <Error t={t}/> }

    </main>
}