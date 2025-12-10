import request from '../../controllers/categories/disableCategoryController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export const deleteCategory = async(slug:string, applyToChildren?:boolean):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (slug) {

            // Solicitar la petición al Backend
            const response = await request(slug, applyToChildren)

            // Devuelve la respuesta del Backend
            resolve(response)

        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default deleteCategory