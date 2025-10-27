import styles from './Articles.module.css'

export default () => {
    return <>
        <div className={`${styles.nocontent} flex-center-column unselectable`}>
            <p>¡Gracias por visitarnos!</p>
            <br/>
            <p>De momento no tenemos productos para mostrar</p>
            <br/>
            <p>Pero pronto actualizaremos nuestro catálogo</p>
            <br/>
            <p>Por favor, vuelva más tarde</p>
        </div>
    </>
}