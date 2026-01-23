import Price from '../../article/components/price/Price'
import styles from './Articles.module.css'

export default ({ articles, onClick, t }) => {

    return articles ? <section className={styles.articles}>
        { articles.map((article, key) => 
            <Article
                article={article}
                onClick={() => onClick(article)}
                t={t}
                key={key}
            />
        )}
    </section> : <p>{t('empty')}</p>

}

const Article = ({ article, onClick, t }) => {

    return article && <article id={article.index} className={styles.article} onClick={onClick}>
        <p className={styles.name}>{article.variant?.name ?? article.name}</p>
        <div className={styles.image}>
            <img 
                className={styles.img}
                src={article.variant?.images[0]?.src ?? article.images[0]?.src}
            />
        </div>
        <p>{t('quantity')} <span className={styles.quantity}>{article.quantity}</span></p>
        { article?.variant?.attributes.map(attribute => <p>{attribute?.valueName}</p> )}
        <Price
            multiplier={article.quantity}
            price={article.variant?.price ?? article.price}
            discount={article.variant?.discount ?? article.discount}
            installments={article.variant?.installments ?? article.installments}
            installmentsPrice={article.variant?.installmentsPrice ?? article.installmentsPrice}
            fees={article.variant?.fees ?? article.fees}
        />
        {console.log("AGREGA LOS ATTRIBUTOS")} 
    </article>


}