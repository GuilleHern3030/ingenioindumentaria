import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Attributes.module.css'

import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/Loading'
import { reload, request } from '@/api';

import useUser from "@/hooks/useUser";

export default ({category, t}) => {

    const navigate = useNavigate()
    const param = category ? `?category=${category}` : ''

    return <>
        <div className='flex-center-column'>
            <button 
                className={styles.button} 
                onClick={() => navigate('attributes' + param)}
                >{`${category ? t('attributes_set') : t('attributes_set_global') }`}
            </button> 
        </div>
    </>
}