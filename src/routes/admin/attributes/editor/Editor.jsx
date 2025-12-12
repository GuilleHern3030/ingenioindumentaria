import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import styles from '../Attributes.module.css'

import { put, disable, remove, enable, get } from '@/api/attributes'
import { devMode, request } from "@/api";

import Editor from '../components/editor/Editor';
import Loading from "@/components/loading/FullLoading";
import Alert from "@/components/alert/Alert";
import useUser from "@/hooks/useUser";

const reload = () => window.location.reload()

export default () => {

    const { t } = useOutletContext();

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    const { setIsAdminSessionActive } = useUser()

    const [ attribute, setAttribute ] = useState()
    const [ from, setFrom ] = useState()
    const [ slug, setSlug ] = useState()

    const [ dialog, setDialog ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState()

    useEffect(() => {
        request(setIsLoading, setError, get, id, true)
        .then(attribute => {
            setAttribute(attribute)
            if (location.state) {
                setFrom(location.state.from)
                setSlug(location.state.slug)
            }
        })
        .catch(e => { console.error(e); setAttribute(null) })
    }, [])

    const goBack = (result) => {
        if (!devMode() || !result) {
            navigate(`${from}?slug=${slug}`, { replace: true })
            reload()
        }
        else setDialog(<Alert
            title={"Changes saved"}
            message={"To view them, you must reload the page"}
            onAccept={() => {
                navigate(`${from}?slug=${slug}`, { replace: true })
                reload()   
            }}
        />)
    }

    const handleEdit = (data) => {
        console.log("Saving:", data)
        const { attribute, slugs } = data
        request(setIsLoading, setError, put, attribute, slugs)
        .then(result => { reload() })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    const handleDelete = (attribute) => {
        const deleter = attribute?.isActive() ? disable : remove
        request(setIsLoading, setError, deleter, attribute)
        .then(result => { attribute?.isActive() ? goBack(result) : reload() })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    const handleEnable = (attribute) => {
        request(setIsLoading, setError, enable, attribute)
        .then(result => { goBack(result) })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    return <>
        <p className={styles.subtitle}>Editor</p>
        { error && <p className="error">{error}</p>}
        { attribute && 
            <Editor 
                attribute={attribute}
                defaultCategories={attribute.slugs()}
                onSuccess={handleEdit} 
                onCancel={goBack} 
                onDelete={handleDelete}
                onEnable={handleEnable}
                t={t}
            /> 
        }

        { 
            isLoading ? <Loading/> :
            attribute === null && 
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