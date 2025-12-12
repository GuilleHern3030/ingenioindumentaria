import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useOutletContext } from "react-router-dom";

import styles from './Index.module.css'

import { getParams } from "@/hooks/useParams"

// Icons
import addIcon from "@/assets/icons/add.webp"

// Componentes globales
import Dialog from "@/components/dialog/Dialog"
import Loading from "@/components/loading/Loading"

// Componentes locales
import Slug from "../../components/slug/Slug"
import Reload from "../../components/reload/Reload"

import Attributes from "../components/attributes/Attributes";

import { selectByCategory, selectAll } from '@/api/attributes'
import { request } from "@/api";


export default function() {

    const { t } = useOutletContext();

    const [ dialog, setDialog ] = useState()

    const [ error, setError ] = useState()
    const [ isLoading, setIsLoading ] = useState()
    const [ networkError, setNetworkError ] = useState(false)
    
    // Attributes
    const [ attributes, setAttributes ] = useState()
    const [ slug, setSlug ] = useState('')

    const initialized = useRef(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => { loadAttributesFromCategory(slug) }, [slug])

    const loadAttributesFromCategory = (slug) => {
        const selected = slug?.length > 0 ? 
            request(setIsLoading, setError, selectByCategory, slug, true) :
            request(setIsLoading, setError, selectAll, true)
        selected.then(attributes => {
            setAttributes(slug?.length > 0 || attributes.length > 0 ? attributes : undefined)
        }).catch(e => {
            console.error(e)
            if (e?.status() === 503)
                setNetworkError(true)
        })
    }

    const handleFinishEdition = () => {
        loadAttributesFromCategory(slug)
    }

    const handleAttributeSelected = (attribute) => {
        navigate(`${attribute.id}`,
            { 
                state: {
                    from: location.pathname,
                    attribute,
                    slug
                }
            }
        )
    }

    const handleAttributeCreate = () => {
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
        <Slug onSlugChange={(slug) => setSlug(slug)}/>
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
                    //hide={productSelected !== undefined}
                    defaultContracted={!(slug?.length > 0)}
                    attributes={attributes} 
                    title={slug === '' ? t('all_categories') : slug}
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

            </> :  <Reload/>
        }
        { dialog }
    </>

}