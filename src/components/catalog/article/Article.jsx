import { useParams } from 'react-router-dom'

import styles from './Article.module.css'
import useIndexedDB from '../../../hooks/useIndexedDB'
import { useEffect, useState } from 'react'
import Loading from '../../loading/Loading'

import logo from '../../../assets/icons/logo2.webp'
import useClientInfo from '../../../hooks/useClientInfo'

export default function Article()  {

        const { id } = useParams()
        const { isLoading, database } = useIndexedDB()
        const { data } = useClientInfo()

        const [ article, setArticle ] = useState()
        const [ iImage, setIImage ] = useState(0)

        useEffect(() => {
            console.log(id)
            if (id)
                database.selectById(id).then(article => setArticle(article) )
        }, [id])

        const handleAddToCart = () => {

        }

        const handleContact = () => {
            const fullUrl = window.location.href
            const link = encodeURIComponent(fullUrl)
            window.open(data.contactlink + "?text=Hola, quiero consultar por este producto: \n\r" + link, "_blank")
        }

        return !article || isLoading == true ? <Loading/> :
            <div id={article.id()} className={`${styles.article} unselectable`}>
                <p className={styles.category}>{` ${article.category()} ${'/'} ${article.sexName()}`}</p>

                <div className='flex-center-column'>
                    <p className={styles.name}>{article.name()}</p>
                    <p>{article.description()}</p>
                </div>

                <div className={styles.imagecontainer} style={{gridTemplateColumns: article.images().length > 1 ? '2em 1fr 2em' : '1fr'}}>
                    {article.images().length > 1 && <button onClick={i => article.images().length > i ? i+1 : 0}>{'<'}</button> }
                    <img src={ article.images().length > 0 ? article.getImage(iImage).src : logo} className={styles.image}/>
                    {article.images().length > 1 && <button onClick={i => i - 1 < 0 ? article.images().length-1 : i-1}>{'>'}</button> }
                </div>

                <div className='flex-center-column'>
                    <p className={styles.name}>

                        { article.discount() > 0 ? 
                            <>
                                <strike className={styles.strike}>{article.priceText()}</strike> 
                                <span className={styles.newPrice}>${article.price()-article.price()*article.discount()/100}</span> 
                            </>
                        : article.priceText()
                        }
                    </p>
                    
                    {
                     //   <button className={styles.button} onClick={handleAddToCart}>Agregar al carrito</button>
                    }
                    
                    {
                        <button className={styles.white_button} onClick={handleContact}>Consultar</button>
                    }

                </div>

            </div>

}