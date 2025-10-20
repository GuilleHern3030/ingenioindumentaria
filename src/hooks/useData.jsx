import { useContext } from 'react'
import { ClientInfoContext } from '../context/ClientInfoContext'

export default function useData() {
    const { data } = useContext(ClientInfoContext)
    return data;
}