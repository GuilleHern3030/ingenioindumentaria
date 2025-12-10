import request from '../../controllers/categories/enableCategoryController'
import handleError from '../errorHandler'
import { Category } from '@/api/objects/Category'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export const enableCategory = async(slug:string):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (slug) {

            // Solicitar la petición al Backend
            const response = await request(slug)

            // Devuelve la respuesta del Backend
            resolve(response)

        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default enableCategory