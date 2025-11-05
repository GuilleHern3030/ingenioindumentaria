import { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
export default () => {
    const context = useContext(UserContext)
    //useEffect(() => { context.update() }, [])
    return context
}