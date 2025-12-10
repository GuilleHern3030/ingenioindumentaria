import request from '../../controllers/external/updateGoogleSheetController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'

export const update = async():Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Solicitar la petición al Backend
        const req = await request()
        resolve(req)

    } catch(err:any) { reject(handleError(err)) }
    else reject(handleError("La sesión caducó. Vuelve a iniciar sesión para continuar."))
})

export default update