import styles from './Loading.module.css'
export default function Loading({style, color, backgroundColor, className}) {
    return <div 
        className={`${styles.spinner} ${className ? className : ""}`} 
        style={{
            borderColor: color,
            borderLeftColor: backgroundColor,
            ...style
        }}/>
}