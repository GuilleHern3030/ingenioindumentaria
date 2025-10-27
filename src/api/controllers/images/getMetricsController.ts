import axios from '../axios.ts'
import { getLocalToken, getLocalUser } from '../../../api'

const endpoint = "/cloudflare";

/**
 * Establece la conexión con una api que conecte a una Base de Datos
 * @returns {Promise} Devuelve una promesa con información de la tabla
 */
export const getMetrics = async(): Promise<any> => {

    const { data } = await axios.get(
        endpoint,
        {
            headers: { 
                token: getLocalToken(), 
                user: getLocalUser() 
            } 
        }
    )

    return data;
}

export default getMetrics