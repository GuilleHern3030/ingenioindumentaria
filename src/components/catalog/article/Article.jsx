import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useDataBase from '../../../hooks/useDataBase'

import styles from './Article.module.css'
import Loading from '../../loading/Loading'

import logo from '../../../assets/icons/logo2.webp'
import useClientInfo from '../../../hooks/useClientInfo'

export default function Article()  {

        const { id } = useParams()
        const { isLoading, database } = useDataBase()
        const { data } = useClientInfo()
        const imageRef = useRef()

        const [ article, setArticle ] = useState()
        const [ image, setImage ] = useState()
        const [ imageHeight, setImageHeight ] = useState(0)
        const [ showedImage, setShowedImage ] = useState()

        useLayoutEffect(() => { 
            if (id) database.selectById(id).then(article => {
                setArticle(article) 
                setImage(0)
            })
        }, [id])

        useEffect(() => {
            if (article) {
                setImageHeight(imageRef.current.clientHeight)
                setShowedImage(prev => prev != undefined ? image : undefined)
            }
        }, [image])

        const handleAddToCart = () => {

        }

        const handleContact = () => {
            const fullUrl = window.location.href
            const link = encodeURIComponent(fullUrl)
            window.open(data.contactlink + "?text=Hola, quiero consultar por este producto: \n\r" + link, "_blank")
        }

        const handleShowImage = e => {
            e.stopPropagation()
            setShowedImage(prevImage => prevImage === undefined ? image : undefined)
        }

        const handleChangeImage = (event, up) => {
            event.stopPropagation()
            if (up === true) setImage(i => i+1 < article.images().length ? i+1 : 0)
            else setImage(i => i - 1 < 0 ? article.images().length-1 : i-1)
        }

        return !article || isLoading == true ? <Loading/> :
            <div id={article.id()} className={`${styles.article} unselectable`}>

                { showedImage !== undefined ? 
                    <div 
                        className={styles.bigimagecontainer} 
                        onClick={handleShowImage}>
                            <div onClick={handleShowImage} className={styles.buttonscontainer} style={{height:'100vh'}}>
                                <div>{article.images().length > 1 && <button className={styles.button} onClick={e => handleChangeImage(e,false)}>{'<'}</button> }</div>
                                <div>{article.images().length > 1 && <button className={styles.button} onClick={e => handleChangeImage(e, true)}>{'>'}</button> }</div>
                            </div>
                            <img className={styles.bigimage} src={article.getImage(showedImage).src}/>
                    </div> : <></>
                }

                <p className={styles.category}>{` ${article.category()} ${'/'} ${article.sexName()}`}</p>
                <p className={styles.name}>{article.name()}</p>

                <div className={styles.description}>

                    <div className={styles.imagecontainer}>
                        <div onClick={handleShowImage} className={styles.buttonscontainer} style={{height:imageHeight}}>
                            <div>{article.images().length > 1 && <button className={styles.button} onClick={e => handleChangeImage(e,false)}>{'<'}</button> }</div>
                            <div>{article.images().length > 1 && <button className={styles.button} onClick={e => handleChangeImage(e, true)}>{'>'}</button> }</div>
                        </div>
                        <img ref={imageRef} className={styles.image} src={ article.images().length > 0 ? article.images()[image].src : logo}/>
                    </div>

                    <div className='flex-center-column'>
                        <p className={styles.description_text}>{article.description()}</p>

                    </div>
                </div>

                <div className={styles.attributes}>
                    <p>Talles disponibles</p>
                    <p style={{paddingLeft:'1em'}}>{article.sizes().map((size, index) => <span key={index}>{size}{index < article.sizes().length - 1 && ', '}</span>)}</p>
                </div>

                <div className={styles.price}>

                    { article.discount() > 0 ? 
                        <>
                            <p> 
                                <strike className={styles.strike}>{article.priceText()}</strike> 
                                <span className={styles.discount}>{article.discount()}% OFF</span> 
                            </p>
                            <br/>
                            <p><span className={styles.discounted}>${article.priceDiscounted()}</span></p>
                        </> : 
                        <p style={{paddingTop:'1em'}}><span className={styles.discounted}>{article.priceText()}</span></p>
                    }

                    {
                        //<button className={styles.white_button} onClick={handleAddToCart}>Agregar al carrito</button>
                    }
                    
                    {
                        <button className={styles.white_button} onClick={handleContact}>Consultar</button>
                    }

                </div>

            </div>
}