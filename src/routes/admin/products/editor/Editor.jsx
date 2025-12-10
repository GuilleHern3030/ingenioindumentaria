import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import styles from '../Products.module.css'

import { disable, remove, edit, get } from '@/api/products'
import { devMode, request } from "@/api";

import Editor from '../components/editor/Editor';
import Loading from "@/components/loading/FullLoading";
import Alert from "@/components/alert/Alert";
import useUser from "@/hooks/useUser";

export default () => {

    const { t } = useOutletContext();

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    const { setIsAdminSessionActive } = useUser()

    const [ product, setProduct ] = useState()
    const [ from, setFrom ] = useState()
    const [ slug, setSlug ] = useState()

    const [ dialog, setDialog ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()

    useEffect(() => {
        request(setIsLoading, setError, get, id, true)
        .then(product => {
            console.log("product:", product)
            setProduct(product)
            if (location.state) {
                setFrom(location.state.from)
                setSlug(location.state.slug)
            }
        })
        .catch(e => { console.error(e); setProduct(null) })
    },[])

    const goBack = (result) => {
        if (!devMode() || !result) {
            navigate(`${from}?slug=${slug}`, { replace: true })
            window.location.reload()
        }
        else setDialog(<Alert
            title={"Changes saved"}
            message={"To view them, you must reload the page"}
            onAccept={() => {
                navigate(`${from}?slug=${slug}`, { replace: true })
                window.location.reload()   
            }}
        />)
    }

    const handleEdit = (data) => {
        console.log("Saving:", data)
        request(setIsLoading, setError, edit, data)
        .then(result => { 
            if (devMode()) 
                window.location.reload() 
            else goBack(result) 
        })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    const handleDelete = (product) => {
        const deleter = product?.isActive() ? disable : remove
        request(setIsLoading, setError, deleter, product)
        .then(result => { goBack(result) })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    return <>
        <p className={styles.subtitle}>{t('editor')}</p>
        { error && <p className="error">{error}</p>}
        { product && 
            <Editor 
                product={product}
                onSuccess={handleEdit} 
                onCancel={goBack} 
                onDelete={handleDelete}
                t={t}
            /> 
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