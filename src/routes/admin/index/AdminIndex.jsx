import { useNavigate } from 'react-router-dom'
import styles from './AdminIndex.module.css'

import { devMode } from '@/api'
import { useRouteI18n } from "@/hooks/useRouteI18N"
import Loading from '@/components/loading/FullLoading'

import englishFlag from '@/assets/icons/english-flag.webp'
import spanishFlag from '@/assets/icons/spanish-flag.webp'

export default () => {

    const { t, ready, language, setLanguage } = useRouteI18n()

    const navigate = useNavigate()

    return ready ?
        <main className='unselectable'>
        
            {/*<section className={styles.flags}>
                <div>
                    <img id="es" src={spanishFlag} className={`${styles.flag} ${language === "es" && styles.flag_active}`} onClick={e => setLanguage(e.target.id)}/>
                    <img id="en" src={englishFlag} className={`${styles.flag} ${language === "en" && styles.flag_active}`} onClick={e => setLanguage(e.target.id)}/>
                </div>
            </section> */}

            <section className={styles.list}>
                <button className={styles.button} onClick={() => navigate("categories")}>{t('categories')}</button>
                <button className={styles.button} onClick={() => navigate("products")}>{t('products')}</button>
                <button className={styles.button} onClick={() => navigate("attributes")}>{t('attributes')}</button>
                <button className={styles.button} onClick={() => navigate("messages")}>{t('messages')}</button>
                <button className={styles.button} onClick={() => navigate("workers")}>{t('workers')}</button>
            </section>
        </main> : <Loading />
}