import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useOutletContext } from "react-router-dom";

import styles from './Index.module.css'

// Icons
import addIcon from "@/assets/icons/add.webp"

// Componentes globales
import Loading from "@/components/loading/Loading"

// Componentes locales
import Slug from "../components/slug/Slug"
import Reload from "../../components/reload/Reload"

import Attributes from "../components/attributes/Attributes";

import { selectAll } from '@/api/attributes'
import { request } from "@/api";


export default function() {

    const { t } = useOutletContext<any>()

    const [ error, setError ] = useState()
    const [ isLoading, setIsLoading ] = useState()
    const [ networkError, setNetworkError ] = useState(false)
    
    // Attributes
    const [ attributes, setAttributes ] = useState()

    // Categories
    const [ categories, setCategories ] = useState()
    const [ slug, setSlug ] = useState('')

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => { loadData() }, [ ])

    const loadData = () => {
        request(setIsLoading, setError, selectAll)
        .then((attributes:any) => {
            console.log("Response", attributes)
            console.log("Categories", attributes.categories)
            setCategories(attributes.categories)
            setAttributes(attributes)
            setNetworkError(false)
        })
        .catch(e => {
            console.error(e)
            if (e?.isNetworkError())
                setNetworkError(true)
        })
    }

    const handleSlugChange = (slug:string) => {
        setSlug(slug)
    }

    const handleAttributeSelected = (attribute: Record<string, any>) => {
        window.scrollTo({top:0})
        navigate(`${attribute.id}`,
            { 
                state: {
                    from: location.pathname,
                    attribute,
                    categories,
                    slug: slug ?? ''
                }
            }
        )
    }

    const handleAttributeCreate = () => {
        window.scrollTo({top:0})
        navigate("new", 
            {
                state: { 
                    from: location.pathname,
                    slug: slug ?? ''
                }
            }
        )
    }

    return <>
        { categories && <Slug categories={categories} onSlugChange={(slug:string) => handleSlugChange(slug)}/> }
        { error && <p className='error'>{error}</p> }
        { !slug && 
            <section className={styles.instructions}>
                <p className={styles.instruction}>{ t('instruction_1') }</p>
                <p className={styles.instruction}>{ t('instruction_2') }</p>
                <p className={styles.instruction}>{ t('instruction_3') }</p>
            </section>
        }
        <hr/>
        {
            (isLoading === true) ? <Loading/> : 
            !networkError ? <>

                <Attributes 
                    defaultContracted={!(slug?.length > 0)}
                    slug={slug}
                    attributes={attributes} 
                    title={ slug === '' ? t('all_categories') : slug.replace("-", " ") }
                    onAttributeSelected={handleAttributeSelected}
                    t={t}
                />
            
                {
                    <>
                        <hr/>
                        <div className={styles.button} onClick={handleAttributeCreate}>
                            <img src={addIcon}/>
                        </div>
                    </>
                }

            </> :  <Reload onClick={loadData}/>
        }
    </>

}