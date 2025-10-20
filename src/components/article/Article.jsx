import styles from './Article.module.css'

export default function Article({
    id, 
    name, 
    category,
    description,
    price,
    sizes,
    sex,
    recently,
    imageSrc,
    className,
    onClick
}) 
    {

        const img = imageSrc.includes(",") ? imageSrc.split(",") : imageSrc

        return <div className={className} id={id}>
            <div className={styles.imgcontainer}>
                <img src={imageSrc}/>
            </div>
        </div>

}