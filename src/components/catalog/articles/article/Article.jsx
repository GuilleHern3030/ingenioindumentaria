import { useState } from 'react'
import styles from './Article.module.css'
import loading from '../../../../assets/icons/logo.webp'

export default function Article({ article, className, onClick }) {

    const [ isLoaded, setIsLoaded ] = useState(false)

    return <article className={`${className} ${styles.article} unselectable cursor`} id={article.id()} onClick={onClick}>

        <div className={styles.imgcontainer}>
            {
                !isLoaded && (
                <div className={styles.placeholder}>
                    <img src={loading} alt="Cargando..." className={styles.placeholderImg} />
                </div>
                )
            }
            { article.images().length > 0 && 
                <img 
                    src={article.getImage(0).src}
                    alt={article.name()}
                    className={`${styles.image} ${styles.img} ${isLoaded ? styles.visible : styles.hidden}`}
                    onLoad={() => setIsLoaded(true)}
                    loading='lazy'
                />
            }
        </div>

        <div className={styles.infocontainer}>
            { article.recent() && <p className={styles.new}>Nuevo!</p> }
            <p className={styles.name}>{article.name()}</p>
            <p className={styles.price}>
                { article.discount() > 0 ? <><strike className={styles.strike}>{article.priceText()}</strike> <span className={styles.newPrice}>${article.price()-article.price()*article.discount()/100}</span> </>
                : article.priceText()
                }

            </p>
        </div>

    </article>

}