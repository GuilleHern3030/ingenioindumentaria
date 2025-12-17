import { useState, useEffect } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'

import styles from './Categories.module.css'

import { useRouteI18n } from '@/hooks/useRouteI18N'
import useDataBase from '@/hooks/useDataBase'
import { getParams, queryParams } from '@/hooks/useParams'

import StringUtils from '@/utils/StringUtils'
import QueryUtils from '@/utils/QueryUtils'
import IdUtils from '@/utils/IdUtils'

import { Attributes } from '@/api/objects/Attributes'

import { lazyLoadLimit } from '@/api/config.json'

import Loading from '@/components/loading/LogoLoading'

import Collection from './components/collection/Collection'
import Filters from './components/filters/Filters'
import Filter from './components/filter/Filter'
import Articles from '@/components/articles/Articles'

const ROUTE_NAME = "category"

const COLUMNS_PREDEFINED = 'template-columns'
const getColumns = () => localStorage.getItem(COLUMNS_PREDEFINED) ?? 2
const setColumns = (c) => localStorage.setItem(COLUMNS_PREDEFINED, c)

export default () => {

    const { t, ready } = useRouteI18n("main/categories")

    const { "*": slug } = useParams() // obtiene todo el slug
    const navigate = useNavigate()
    
    const { 
        getArticles, countArticles,
        getRecent, countRecent,
        getMost, countMost,
        getAttributes, 
        isLoading, error 
    } = useDataBase()

    const [ warning, setWarning ] = useState()

    const [ articlesCount, setArticlesCount ] = useState()
    const [ articles, setArticles ] = useState()
    const setData = (data) => {
        setArticles(data?.articles ?? []) 
        setArticlesCount(data?.size)
    }

    const [ attributes, setAttributes ] = useState()

    const [ order, setOrder ] = useState({id:0})
    const [ filters, setFilters ] = useState(getParams())
    const setFilter = (filter) => {

    }

    const handleSetFilters = (filters, order) => {
        if (isLoading !== true)
            loadArticles(filters, order, slug)
            .then(articles => {
                setData(articles)
                setFilters(filters)
                setOrder(order)
                const route = location.pathname.replaceAll('/', '').includes(ROUTE_NAME) ? ROUTE_NAME : location.pathname.split('/')[0]
                const params = slug ?? '' + QueryUtils.stringify({ ...filters }) ?? ''
                navigate(`/${route}` + params.length > 0 ? `/${params}` : '')
            })
            .catch(() => { // no articles found
                console.warn("No articles with that filters:", filters)
                setWarning(t('no_articles_filter'))
            })
    }

    const [ columns, setColumnsState ] = useState(Number(getColumns()))
    useEffect(() => { setColumns(columns) }, [columns])

    const [ page, setPage ] = useState(1)

    const handleSetPage = (page) => {
        if (isLoading !== true)
            loadArticles(filters, order, slug, page)
            .then(articles => setData(articles))
            .catch(() => setData(null))
        setPage(page)
    }

    useEffect(() => {
        //console.clear()
        /*if (isLoading !== true)
            loadArticles(filters, order, slug)
            .then(articles => setArticles(articles))
            .catch(() => setArticles([]))*/
        handleSetPage(1)
        setAttributes(getAttributes(slug))
    }, [location.pathname])

    useEffect(() => {
        if (articles !== undefined && QueryUtils.stringify(filters) != location.search && isLoading !== true) {
            setFilters(getParams())
            loadArticles(getParams(), order, slug)
            .then(articles => setData(articles))
            .catch(() => setData(null))
        }
        setWarning()
    }, [location.search])

    useEffect(() => {
        if (Array.isArray(articles) && articles.length == 0) {
            loadArticles(getParams(), order, '')
            .then(articles => setData(articles))
            .catch(() => { console.warn("No articles available") })
            navigate(`/${ROUTE_NAME}`, { replace: true })
            setWarning(t('no_articles'))
        }
    }, [articles])

    const loadArticles = async(filters, order, slug, page=1) => new Promise((resolve, reject) => {
        setWarning()
        setPage(page)

        const filtersToApply = Attributes.toFilters(filters, attributes)
        const orderToApply = order?.id === 0 ? null : order
        const get = 
            location.pathname.replaceAll('/', '') == 'recent' ? getRecent(orderToApply, page) :
            location.pathname.replaceAll('/', '') == 'promos' ? getMost(orderToApply, page) :
            getArticles(slug ?? '', true, filtersToApply, orderToApply, page) 
        get.then(data => {
            console.log("data:", data)
            if (data.articles?.length > 0) resolve(data)
            else reject([])
        }).catch(e => { 
            console.error(e)
            reject()
        })
    })

    const handleArticleSelect = (id, variantId) => 
        navigate("/article/" + IdUtils.serialize(id, variantId, slug) + QueryUtils.stringify({ ...filters }))

    return (isLoading === true || !ready || articles === undefined) ? <Loading/> : <>
        <main className={styles.main}>

            {/* Sección donde se mostrará el nombre de la colección (slug) y el número de productos */}
            <Collection
                className={styles.collection}
                slug={slug}
                articlesCount={articlesCount}
                t={t}
            />

            <hr/>

            {/* Sección donde se mostrará los filtros disponibles y manipular cómo se mostrarán los objetos */}
            <Filters 
                attributes={attributes}
                className={styles.filters}
                columns={columns}
                filters={filters}
                order={order}
                onChangeFilters={(filters, order) => handleSetFilters(filters, order)}
                onChangeColumns={(columns) => setColumnsState(columns)}
                t={t}
            />
            
            <hr/>

            {/* Sección donde se mostrará un filtro específico (opcional) definido en el Category */}
            <Filter 
                className={styles.filter}
                onChangeFilter={setFilter}
                slug={slug}
                t={t}
            />

            { error && <p className='error'>{error}</p> }
            { warning && <p className='warning'>{warning}</p> }

            {/* Sección donde se mostrarán los artículos */}
            <Articles 
                columns={columns}
                articles={articles}
                className={styles.articles}
                onSelect={handleArticleSelect}
                pages={Math.ceil((articlesCount ?? 1) / lazyLoadLimit)}
                onPageChange={handleSetPage}
                page={page}
                t={t}
            />

        </main>
    </>

}