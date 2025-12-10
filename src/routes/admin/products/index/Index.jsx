import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useOutletContext } from "react-router-dom";

import styles from './Index.module.css'

import { selectAll } from "@/api/products"
import { devMode } from "@/api";

// Icons
import addIcon from "@/assets/icons/add.webp"

// Componentes globales
import Dialog from "@/components/dialog/Dialog"

// Componentes locales
import Slug from "../../components/slug/Slug"
import Products from "../components/products/Products"
import Editor from "../components/editor/Editor"

export default () => {

    const { t } = useOutletContext();

    const [ dialog, setDialog ] = useState()

    // Categories
    const [ categories, setCategories ] = useState()
    const [ slug, setSlug ] = useState('')

    const initialized = useRef(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true

        if (devMode())
            selectAll(true)

    }, [])

    const handleProductSelected = (product) => {
        navigate(`${product.id()}`,
            { 
                state: {
                    from: location.pathname,
                    product: product.toJson(),
                    slug
                }
            }
        )
    }

    const handleProductCreate = () => {
        navigate("new", 
            {
                state: { 
                    from: location.pathname,
                    slug 
                }
            }
        )
    }

    return <>
        { <Slug onSlugChange={(slug) => setSlug(slug)} onCategoriesLoaded={setCategories} params={true} /> }
        { !slug && 
            <section className={styles.instructions}>
                <p className={styles.instruction}>{ t('instruction_1') }</p>
                <p className={styles.instruction}>{ t('instruction_2') }</p>
                <p className={styles.instruction}>{ t('instruction_3') }</p>
                <p className={styles.instruction}>{ t('instruction_4') }</p>
            </section>
        }
        <hr/>
        {
            <>
                <Products 
                    slug={slug} 
                    title={slug === '' ? t('product_without_category') : slug}
                    onProductSelected={handleProductSelected}
                    t={t}
                />

                {
                    <>
                        <hr/>
                        <div className={styles.button} onClick={handleProductCreate}>
                            <img src={addIcon}/>
                        </div>
                    </>
                }

            </>
        }

        { dialog }
    </>
}