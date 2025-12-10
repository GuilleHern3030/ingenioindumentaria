import { useEffect, useState } from "react"
import styles from './Slug.module.css'

export default ({className, slug, onParentClick=()=>{}, onSelfClick=()=>{}}) => {

    const [ routes, setRoutes] = useState()

    useEffect(() => {
        if (slug) {
            const slugs = slug.split("/");
            const slugged = slugs.map((_, i) => slugs.slice(0, i + 1).join("/"));
            const routes = slugs.map((slug, index) => <div className="flex-center" key={index}>
                <p className={styles.separator} >/</p>
                <p
                    className={styles.route} 
                    id={`${slugged[index]}-${index}/${slugs.length}`}
                    onClick={(slugs.length !== (index+1)) ? () => onParentClick(slugged[index]) : () => onSelfClick(slugged[index])}
                    >{slug.toLowerCase()} 
                </p>
            </div>
            )

            setRoutes(routes)

        } else setRoutes()
    }, [slug])

    return <div className={`${styles.routes} ${className}`}>
        <p className={styles.route} onClick={() => onParentClick()}>{"index"}</p>
        {routes}
    </div>

}