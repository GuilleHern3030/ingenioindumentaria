import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useOutletContext } from "react-router-dom"

import styles from '../Products.module.css'

import { EditorContextProvider } from "../layouts/editor/context"
import Editor from '../layouts/editor/Editor.tsx'

import { disable, remove, edit, select } from '@/api/products'
import { verifySizeLimit } from "@/api/images"
import { devMode, request } from "@/api"

import Alert from "@/components/alert/Alert"
import Loading from "@/components/loading/FullLoading"
import useUser from "@/hooks/useUser"

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
    const [ product, setProduct ] = useState()

    const [ dialog, setDialog ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()

    const { id } = useParams()

    useEffect(() => {
        const loadProduct = (tries = TRIES) => {
            request(setIsLoading, setError, select, id)
            .then(response => {
                console.log("product:", response.product)

                setProduct(response.product)
                setAttributes(response.attributes)
                setCategories(response.categories)

                if (location.state) {
                    setFrom(location.state.from)
                    setSlug(location.state.slug)
                }
            })
            .catch(e => {
                if (e.adminSessionExpired()) setIsAdminSessionActive(false)
                else if (tries > 0) loadProduct(tries - 1)
                else {
                    console.error(e)
                    setProduct(null) 
                }
            })
        }
        loadProduct()
    },[])

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

    const handleEdit = (data, tries = TRIES) => {
        setIsLoading(true)
        verifySizeLimit(data.product, data.variants)
        .then(ok => {
            if (ok === true) {
                request(setIsLoading, setError, edit, data)
                .then(result => { goBack(result) })
            } else setError(t(`image_error_${ok}`))
        }).catch(e => { // network error
            if(e.adminSessionExpired()) setIsAdminSessionActive(false)
            else if (tries > 0) handleEdit(data, tries - 1)
            else {
                document.getElementById("header")?.scrollIntoView({ behavior: "smooth" })
                console.error(e)
                setError(e.toString())
            }
        })
    }

    const handleDelete = (product, tries = TRIES) => {
        const deleter = product?.disabled !== true ? disable : remove
        request(setIsLoading, setError, deleter, product)
        .then(result => { goBack(result) })
        .catch(e => {
            if(e.adminSessionExpired()) setIsAdminSessionActive(false)
            else if (tries > 0) handleDelete(product, tries - 1)
            else {
                document.getElementById("header")?.scrollIntoView({ behavior: "smooth" })
                setError(e.toString())
                console.error(e)
            }
        })
    }

    return <>
        <p className={styles.subtitle}>{t('editor')}</p>
        { error && <p className="error">{error}</p>}
        { product && 
            <EditorContextProvider
                product={product}
                categories={categories}
                attributes={attributes}
                slug={slug}
                ><Editor 
                    onSuccess={handleEdit} 
                    onCancel={goBack}
                    onDelete={handleDelete}
                    t={t}
                /> 
            </EditorContextProvider>
        }

        { 
            isLoading ? <Loading/> :
            product === null && 
                <div className="flex-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className='button_square_white'>
                        {t('back')}
                    </button>
                </div>
        }
        
        {dialog}
        
    </>
    
}