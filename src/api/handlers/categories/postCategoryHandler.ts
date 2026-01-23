import request from '../../controllers/categories/postCategoryController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'
import category from '@/api/models/Category'

export const postCategory = async(categoryName:string, parentSlug?:string):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (categoryName) {

            // Dar formato correcto al nombre
            const newName = categoryName.replace(/[\/\-\_\!\,\.]/g, "")

            // Solicitar la petición al Backend
            const response:category = await request(
                newName,
                parentSlug
            )

            // Devuelve la respuesta del Backend
            resolve(response)
            
        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default postCategory