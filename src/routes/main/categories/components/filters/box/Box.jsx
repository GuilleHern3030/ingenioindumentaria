import styles from './Box.module.css'

const printBoxes = (boxes, selected) => {
    const boxesArray = []
    for (let key = 0; key < boxes*boxes; key++) {
        boxesArray.push(
            <div 
                key={key} 
                className={selected === true ? styles.box_selected : styles.box_unselected}
                style={{
                    margin:`${0.15/boxes}em`
                }}
            />
        )
    }
    return boxesArray
}

export default ({className='', onClick=()=>{}, boxes=1, selected=false}) => {
    return <div className={`${className} ${styles.box_container}`}>
    <div 
        className={styles.box_border} 
        style={{
            gridTemplateColumns:`repeat(${boxes}, ${1.5/boxes}em)`,
            gridTemplateRows:`repeat(${boxes}, ${1.5/boxes}em)`
        }}
        onClick={onClick}>
        { printBoxes(boxes, selected) }
    </div>
    </div>
}