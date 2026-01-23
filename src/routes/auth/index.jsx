import { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.css'

import { getParams } from '@/hooks/useParams'
import useUser from '@/hooks/useUser'

export default () => {

    const navigate = useNavigate()

    const { signIn } = useUser()

    const handleSession = async(params) => {
        const response = await signIn()
    }

    useLayoutEffect(() => { 
        const params = getParams()
        console.log(params)
    }, [])

    return <>
    </>
}