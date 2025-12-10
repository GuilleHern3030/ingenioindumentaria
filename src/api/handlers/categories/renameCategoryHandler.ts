import request from '../../controllers/categories/renameCategoryController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import { Category } from '@/api/objects/Category'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export const renameCategory = async(slug:string, newName:string):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (slug) {

            if (newName && newName.length > 0) {

                // Solicitar la petición al Backend
                const response = await request( slug, newName )

                // Devuelve la respuesta del Backend
                resolve(new Category(response)) // true

            } else reject(handleError(t("error:handle_error_body")))
        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default renameCategory