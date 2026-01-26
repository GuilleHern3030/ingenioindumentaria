import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useOutletContext } from "react-router-dom"

import styles from '../Products.module.css'

import { EditorContextProvider } from "../layouts/editor/context"
import Editor from '../layouts/editor/Editor.tsx'

import { create, select } from '@/api/products'
import { verifySizeLimit } from "@/api/images"
import { devMode, reload, request } from "@/api"

import Alert from "@/components/alert/Alert"
import Loading from "@/components/loading/FullLoading"
import useUser from "@/hooks/useUser"
import Reload from "../../components/reload/Reload"

const TRIES = 5

export default () => {

    const { t } = useOutletContext();

    const navigate = useNavigate()
    const location = useLocation()
    
    const [ from, setFrom ] = useState()
    const [ slug, setSlug ] = useState()

    const { setIsAdminSessionActive } = useUser()

    const [ categories, setCategories ] = useState()
    const [ attributes, setAttributes ] = useState()
    const [ ready, setReady ] = useState(false)

    const [ dialog, setDialog ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()
    
    useEffect(() => {
        const loadProduct = (tries = TRIES) => {
            request(setIsLoading, setError, select)
            .then(response => {

                setAttributes(response.attributes)
                setCategories(response.categories)

                if (location?.state) {
                    setFrom(location.state.from)
                    setSlug(location.state.slug)
                }
                setIsLoading(false)
                setReady(true)
            })
            .catch(e => { 
                if (e.adminSessionExpired()) setIsAdminSessionActive(false)
                else if (tries > 0) loadProduct(tries - 1)
                else {
                    console.error(e)
                }
            })
        }
        loadProduct()
    }, [])

    const goBack = (result) => {

        const back = () => {
            navigate(from ? from : -1, { replace: true })
            window.location.reload()
        }

        if (!devMode() || !result) back()
        else setDialog(<Alert
            title={"Changes saved"}
            message={"To view them, you must reload the page"}
            onAccept={back}
        />)
    }

    const handleCreate = (data, tries = TRIES) => {
        setIsLoading(true)
        verifySizeLimit(data.product, data.variants)
        .then(ok => {
            if (ok === true)
                request(setIsLoading, setError, create, data)
                .then(result => { goBack(result) })
            else setError(t(`image_error_${ok}`))
        }).catch(e => { // network error
            if (e.adminSessionExpired()) setIsAdminSessionActive(false)
            else if (tries > 0) handleCreate(data, tries - 1)
            else {
                console.error(e)
                setError(e.toString())
                document.getElementById("header")?.scrollIntoView({ behavior: "smooth" })
                setIsLoading(false)
            }
        })
    }

    return <>
        <h3 className={styles.subtitle}>Crear</h3>
        
        { error && 
            <>
                <p className="error">{error}</p>
                <Reload onClick={reload}/>
            </>
        }
        
        { ready &&
            <EditorContextProvider
                product={null}
                categories={categories}
                attributes={attributes}
                slug={slug}
                ><Editor 
                    onSuccess={handleCreate} 
                    onCancel={goBack}
                    t={t}
                /> 
            </EditorContextProvider>
        }

        {dialog}

        { isLoading && <Loading/> }
    </>
}