import styles from './Filters.module.css'

export default ({values, prevValue, availables, onSelect, onCancel}) => {

    //console.log("values:", values)
    //console.log("availables",availables)

    return <div className={styles.selector} onClick={onCancel}>
        {
            values.map((val, key) => {
                const component = val != prevValue ? 
                    <p key={key} className={`${styles.value} ${availables?.includes(val) ? styles.available : styles.unavailable}`} onClick={() => onSelect(val)}>{val}</p>
                    : <p key={key} className={`${styles.value} ${styles.selected}`} onClick={() => onSelect(undefined)}>{val}</p>
                return component
            })
        }
    </div>

}