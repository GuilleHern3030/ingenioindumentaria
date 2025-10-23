import Article from "../article/Article"
import styles from "./Articles.module.css"

export default ({articles}) => {

    return <section className={styles.articles}>
        { articles.map((article, key) => 
            <Article 
                key={key} 
                className={styles.article}
                article={article}
            />)
        }
    </section>

}