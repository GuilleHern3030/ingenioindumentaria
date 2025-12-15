import styles from './Language.module.css'

import englishFlag from '@/assets/icons/english-flag.webp'
import spanishFlag from '@/assets/icons/spanish-flag.webp'

import { useRouteI18n } from "@/hooks/useRouteI18N"

export default ({ className }) => {

    const { language, setLanguage } = useRouteI18n()
    
    return <section className={`${className} ${styles.flags}`}>
        <div>
            <img id="es" src={spanishFlag} className={`${styles.flag} ${language === "es" && styles.flag_active}`} onClick={e => setLanguage(e.target.id)}/>
            <img id="en" src={englishFlag} className={`${styles.flag} ${language === "en" && styles.flag_active}`} onClick={e => setLanguage(e.target.id)}/>
        </div>
    </section>
}