import request from '../../controllers/categories/putCategoryController'
import handleError from '../errorHandler'
import { Category } from '@/api/objects/Category'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export const putCategory = async(category:Category):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (category) {

            // Preparamos la información relevante para enviar
            const categoryData = category.toJson()
            if (categoryData.children)
                delete categoryData.children

            // Solicitar la petición al Backend para actualizar Categoría y atributos
            const response = await request( categoryData )

            // Devuelve la respuesta del Backend
            resolve(new Category(response)) // true
            
        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default putCategory