import styles from './Loading.module.css'
export default function Loading({style=undefined, color=undefined, backgroundColor=undefined, className=undefined}) {
    return <div 
        className={`${styles.spinner} ${className ? className : ""}`} 
        style={{
            borderColor: color,
            borderLeftColor: backgroundColor,
            ...style
        }}/>
}