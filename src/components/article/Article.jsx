import styles from './Article.module.css'

export default function Article({
    article,
    className,
    onClick
}) 
    {

        return <div className={className} id={article.id()} onClick={onClick}>
            <p>{article.name()}</p>
            <p>{article.description()}</p>
            <div className={styles.imgcontainer}>
                <img src={article.getImage(0).src}/>
            </div>
        </div>

}