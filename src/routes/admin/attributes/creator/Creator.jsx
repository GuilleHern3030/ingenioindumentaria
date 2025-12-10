import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";

import styles from '../Attributes.module.css'
import Editor from '../components/editor/Editor';

import { post } from '@/api/attributes'
import { devMode, request } from "@/api";

import Alert from "@/components/alert/Alert";
import Loading from "@/components/loading/FullLoading";
import useUser from "@/hooks/useUser";
import { Attribute } from "@/api/objects/Attribute";

export default () => {
    const { t } = useOutletContext();

    const navigate = useNavigate()
    const location = useLocation()
    
    const [ from, setFrom ] = useState()
    const [ slug, setSlug ] = useState()

    const [ dialog, setDialog ] = useState(null)
    const [ ready, setReady ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()

    const { setIsAdminSessionActive } = useUser()
    
    useLayoutEffect(() => {
        if (location?.state) {
            setFrom(location.state.from)
            setSlug(location.state.slug)
        }
        setIsLoading(false)
        setReady(true)
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

    const handleCreate = (data) => {
        const { attribute, slugs } = data
        request(setIsLoading, setError, post, attribute, slugs)
        .then(result => { goBack(result) })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    return <>
        <p className={styles.subtitle}>Crear</p>
        { error && <p className="error">{error}</p>}
        { ready &&
            <Editor 
                attribute={new Attribute('')}
                defaultCategory={slug}
                onSuccess={handleCreate} 
                onCancel={goBack}
                t={t}
            /> 
        }
        {dialog}
        { isLoading && <Loading/> }
    </>
}