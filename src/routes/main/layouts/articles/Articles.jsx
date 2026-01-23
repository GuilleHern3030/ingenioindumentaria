import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import styles from './Articles.module.css'

import { lazyLoadLimit } from '@/api/config.json'
import { Attributes } from '@/api/objects/Attributes'

import { getParams, getParam } from '@/hooks/useParams'
import { useRouteI18n } from '@/hooks/useRouteI18N'
import useDataBase from '@/hooks/useDataBase'

import Query from '@/utils/QueryUtils'
import ID from '@/utils/IdUtils'
import Order from './utils/OrderUtils'

import Loading from '@/components/loading/LogoLoading'
import Articles from './components/articles/Articles'
import Collection from './components/collection/Collection'
import Filters from './components/filters/Filters'
import Filter from './components/filter/Filter'

const COLUMNS_PREDEFINED = 'template-columns'
const getColumns = () => localStorage.getItem(COLUMNS_PREDEFINED) ?? 2
const setColumns = (c) => localStorage.setItem(COLUMNS_PREDEFINED, c)

const goTop = () => window.scrollTo({top:0})

export default ({ params='', parent='/', onLoadRequest, onAttributesRequest = () => {}, onError, onEmptySelect, onSelect }) => {

    const { t, ready } = useRouteI18n("main/layouts/articles")
    const [ warning, setWarning ] = useState()

    const navigate = useNavigate()
    
    const { isLoading, error } = useDataBase()
    const [ columns, setColumnsState ] = useState(Number(getColumns()))
    useEffect(() => { setColumns(columns) }, [columns])

    const [ attributes, setAttributes ] = useState()
    const [ articlesCount, setArticlesCount ] = useState()
    const [ articles, setArticles ] = useState()
    const setData = (data) => {
        setArticles(data?.articles ?? data) 
        setArticlesCount(data?.size ?? data)
    }

    const [ page, setPage ] = useState(Number(getParam('p')) || 1)
    const [ order, setOrder ] = useState(getParam('o') || 0)
    const [ filters, setFilters ] = useState(getParams('p'))

    const setFilter = (filter) => {

    }

    const handleSetFilters = async (filters, order) => {
        setWarning()
        setFilters(filters) // object: ...{ "attributeId": "valueId" }
        setOrder(order) // number
        setPage(1)
        loadArticles(params, 1, filters, order)
    }

    const handleSetPage = (page) => {
        setWarning()
        setPage(page)
        loadArticles(params, page, filters, order)
    }

    const refresh = (pageSelected, filtersSelected=filters, orderSelected=order) => {
        goTop()
        const queryParams = query(pageSelected, orderSelected, filtersSelected)
        console.log("PARAMS:", queryParams)
        navigate(`${location.pathname}${queryParams}`, { replace: true })
    }

    useEffect(() => {
        //console.clear()
        //console.log("%cARTICLES LAYOUT", "color:blue; background:pink; padding:4px; border:1px solid blue;", params)

        loadArticles(params, page, filters, order)

    }, [ params ])
    
    const loadArticles = async(params, page, filters, order) => {

        let tries = 0;

        setWarning()

        const loadData = (params, page, filters, order) => new Promise((resolve, reject) => {

            setData(undefined)

            const attributes = onAttributesRequest(params)
            setAttributes(attributes)

            const filtersToApply = Attributes.toFilters(filters, attributes)
            const orderToApply = order == 0 ? null : Order.get(order)

            /*console.log(`
        [LOAD ARTICLES]
        [Pathname]: ${window.location.pathname}
        [Parent]: ${parent}
        [Params]: ${params}
        [Page]: ${JSON.stringify(page)}
        [Filters]: ${JSON.stringify(filtersToApply)}
        [Order]: ${JSON.stringify(orderToApply)}
        [Attributes]: ${JSON.stringify(attributes)}
            `)*/

            onLoadRequest(page, orderToApply, filtersToApply, params ?? '')

            .then(data => { 
                resolve(data)
                console.log("[RESULT]:", data)
            })

            .catch(e => {
                //console.warn("[RESULT REJECT]:", e)
                reject(e)
            })

        })

        const getArticles = async (params, page, filters, order) => {
            
            if (tries < 5) try {

                const { articles, size } = await loadData(params, page, filters, order)

                if (size > 0 && articles.length > 0) {
                    setArticlesCount(size)
                    setArticles(articles)
                    refresh(page, filters, order)
                    return true
                }

                // Intentar en la página 1
                else if (page > 1) {
                    setPage(1)
                    return getArticles(params, 1, filters, order)
                }

                // Intentar quitar filtros
                else if (Object.keys(filters).length > 0) {
                    setFilters({})
                    setWarning(t('no_articles_filter'))
                    return getArticles(params, 1, {}, order) 
                }

                // Intentar buscar todos los artículos existentes
                //else if (params.length > 0) // setWarning(t('no_articles'))
                //    return getArticles('', page, {}, order)

                // Lanzar error
                setWarning(t('no_articles'))
                setData(null)
                onError() // no articles found
                return false


            } catch(e) { // retry in 2s
                tries++
                setTimeout(async() => await getArticles(params, page, filters, order), 2000) 
                console.error(e)
            }

            else {
                //onNetworkError() // gateway timeout
                onError(500)
                return false
            }
        }

        await getArticles(params, page, filters, order)

    }

    const query = (page, order, filters) => Query.set({
        p: page > 1 ? page : undefined,
        ...filters,
        o: order != 0 ? order : undefined
    })

    const handleSelect = (id, variantId) => {
        const queryParams = query(page, order, filters)
        const from = location.pathname + queryParams
        console.log("Product id:", id)
        console.log("Article id:", variantId)
        console.log("Origin:", from)
        console.log("Filters:", queryParams ?? "None")
        onSelect(id, variantId, queryParams, from)
    }

    return (isLoading === true || !ready) ? <Loading/> : <>
        <main className={styles.main}>

            {/* Sección donde se mostrará el nombre de la colección (route) y el número de productos */}
            <Collection
                className={styles.collection}
                slug={params}
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
                slug={params}
                t={t}
            />

            { error && <p className='error'>{error}</p> }
            { warning && <p className='warning'>{warning}</p> }

            {/* Sección donde se mostrarán los artículos */}
            { articles !== undefined ? 
                <Articles 
                    columns={columns}
                    articles={articles}
                    className={styles.articles}
                    onSelect={handleSelect}
                    onEmptyClick={onEmptySelect}
                    pages={Math.ceil((articlesCount ?? 1) / lazyLoadLimit)}
                    onPageChange={handleSetPage}
                    page={page}
                    t={t}
                /> : <Loading/>
            }

        </main>
    </>

}