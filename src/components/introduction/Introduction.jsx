import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"

import styles from './Introduction.module.css'

import { hasPromos, hasRecent, getMost } from '../../redux/reducers/index/IndexSelector'

import { title } from '../../assets/data/data.json'

export default () => {

    const navigate = useNavigate()

    const recent = useSelector(hasRecent())
    const promos = useSelector(hasPromos())
    const most = useSelector(getMost())

    console.log(most)

    return most && most.length == 0 ? <div className={`${styles.nocontent} flex-center-column unselectable`}>
            <p>¡Gracias por visitarnos!</p>
            <br/>
            <p>De momento no tenemos productos para mostrar</p>
            <br/>
            <p>Pero pronto actualizaremos nuestro catálogo</p>
            <br/>
            <p>Por favor, vuelva más tarde</p>
        </div>
    :
    <main className={styles.main}>
        <section className={styles.title}>
            <p>{title}</p>
        </section>

        <hr/>

        <section className={`${styles.section} ${styles.welcomes} flex-center-column`}>
            <p className={styles.welcome}>Te damos la bienvenida a nuestro sitio web</p>
            <p className={styles.welcome}>Acá vas a poder encontrar todos los productos que tenemos disponibles para vos</p>
        </section>

        <hr/>

        { (recent == true || promos == true) && 
            <section className={`${styles.section} flex-center-column`}>

                { recent == true && <button className={styles.offer} onClick={() => navigate(`/recent`)}> Lo más nuevo </button> }

                { promos == true && <button className={styles.offer} onClick={() => navigate(`/promos`)}> Ofertas </button> }

            </section>
        }

        <hr/>

        { most && most.length > 0 &&
            <section className={`${styles.section} ${styles.most} flex-center-column`}>
                <p className={styles.info}>También podés elegir entre nuestros artículos más solicitados</p>
                {most.map(category => <button className={styles.button} onClick={() => navigate(`/products/${category}`)}>{category}</button>)}
            </section>
        }

        <hr/>


    </main>
}