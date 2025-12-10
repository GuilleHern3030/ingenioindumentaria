import request from '../../controllers/categories/postCategoryController'
import handleError from '../errorHandler'
import { Category } from '@/api/objects/Category'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export const postCategory = async(categoryName:string, parentSlug?:string):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (categoryName) {

            // Solicitar la petición al Backend
            const response = await request(
                categoryName.replace(/[\/\-\_\!\,\.]/g, ""),
                parentSlug
            )

            // Devuelve la respuesta del Backend
            resolve(new Category(response)) // true
            
        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default postCategory