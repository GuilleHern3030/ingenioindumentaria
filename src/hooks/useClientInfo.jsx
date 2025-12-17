import { useContext } from 'react'
import { ClientInfoContext } from '../context/ClientInfoContext'

export default function useClientInfo() {
    const { data, dataLoaded } = useContext(ClientInfoContext)
    return { ...data, dataLoaded }
}