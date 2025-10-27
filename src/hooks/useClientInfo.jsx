import { useContext } from 'react'
import { ClientInfoContext } from '../context/ClientInfoContext'

export default function useClientInfo() {
    return useContext(ClientInfoContext)
}