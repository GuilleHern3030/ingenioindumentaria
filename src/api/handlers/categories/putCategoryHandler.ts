import request from '../../controllers/categories/putCategoryController'
import handleError from '../errorHandler'
import { category } from '../../models/Category'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'

/**
 * Edita una categoría con sus respectivos attributos
 * @param category { slug, disabled, children, attributes }
 * @param applyAttributesToChildren Establece si los atributos de la categoría se establecerán también en las categorías hijas
 * @returns 
 */
export const putCategory = async(category:category, applyAttributesToChildren:boolean):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (category) {

            // Preparamos la información relevante para enviar
            if (category.children)
                delete category.children

            // Solicitar la petición al Backend para actualizar Categoría y atributos
            const response = await request( category, applyAttributesToChildren )

            // Devuelve la respuesta del Backend
            resolve(response) // true
            
        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default putCategory