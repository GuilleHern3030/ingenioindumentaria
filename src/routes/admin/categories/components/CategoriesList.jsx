import styles from './CategoriesList.module.css'

export default ({ parent, options, onClick, t }) => {

    return options && <div className={styles.container}>
        { options && options.length > 0 ?
            options.map((category, index) => 
                <p 
                    key={index} 
                    className={category.disabled ? styles.inactive : styles.active} 
                    onClick={() => onClick(category)}>
                    { category.name }
                </p>
            )
            :
            <div className={styles.empty}>
                <p>{t('categories_empty')}</p>
                { parent && !parent.disabled && <p>{t('categories_create_instruction')}</p> }
            </div>
        }
    </div>

}