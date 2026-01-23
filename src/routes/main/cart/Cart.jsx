import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, replace } from 'react-router-dom'

import useDataBase from '@/hooks/useDataBase'
import useCart from '@/hooks/useCart'
import { useRouteI18n } from '@/hooks/useRouteI18N'

import IdUtils from '@/utils/IdUtils'
import IdsUtils from './utils/IdsUtils'

import styles from './Cart.module.css'

import Loading from '@/components/loading/LogoLoading'

import Articles from './components/Articles'
import useClientInfo from '@/hooks/useClientInfo'

export default () => {

    const { t, ready } = useRouteI18n('main/cart')

    const navigate = useNavigate()

    const { coinSymbol, dataLoaded } = useClientInfo()

    const { "*": rawIds } = useParams() // obtiene todo el param

    const [ articles, setArticles ] = useState()

    const { getArticles, isLoading, error, params } = useCart()

    useEffect(() => {

        const data = IdsUtils.parse(rawIds ?? params())

        getArticles(data.map(id => id.id))
        .then(rawArticles => {
            const articles = rawArticles.map(article => {
                const idSerialized = IdUtils.serialize(article.id, article.variant.id)
                const articleParamData = data.find(d => d.id == idSerialized)
                article.quantity = articleParamData?.quantity
                article.index = idSerialized
                article.currency = coinSymbol // TODO
            })
            setArticles(rawArticles)
            console.log(rawArticles)
        })
        .catch(e => {
            
        })
        
    }, [])

    const handleClick = (article) => {
        console.log(article)
        navigate(`/article/${article.index}`, {
            state: { from: location.pathname }
        })
    }

    return ready && <main className={styles.cart}>

        <h2 className={styles.title}>{t('cart')}</h2>

        { (isLoading || !dataLoaded) ? <Loading/> :
            <Articles
                articles={articles}
                onClick={handleClick}
                t={t}
            />
        }

    </main>

}