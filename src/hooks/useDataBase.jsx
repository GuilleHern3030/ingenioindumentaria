import { useState } from "react"

import api from '../api'

export default function(idb = undefined) {

    const [ isLoading, setIsLoading ] = useState()

    const request = async(req, ...params) => new Promise(async (resolve, reject) => {
        if (isLoading !== true) try {
            setIsLoading(true)
            const result = await req(...params)
            setIsLoading(false)
            resolve(result)
        } catch(e) { reject(e) }
        finally { setIsLoading(false) }
        else reject("A request already launched")
    })

    return {
        isLoading,
        database: {
            length: () => request(api(idb).length), // obtener el número de artículos del catálogo
            maxId: () => request(api(idb).maxId), // obtener el ID más alto del catálogo
            size: () => request(api(idb).size), // obtener el tamaño total de todas las imágenes del catálogo
            pull: (articles) => request(api(idb).pull, articles), // obtener los articulos desde la base de datos externa y ponerla en el IndexedDB
            selectAll: () => request(api(idb).selectAll), // devuelve todos los artículos
            selectById: (id) => request(api(idb).selectById, id), // devuelve un artículo específico
            selectRecent: () => request(api(idb).selectRecent), // devuelve los artículos marcados como 'recientes'
            selectDiscounts: () => request(api(idb).selectDiscounts), // devuelve los artículos que tienen descuento
            selectGenders: () => request(api(idb).selectGenders), // devuelve los géneros disponibles en el catálogo
            selectCategoriesOfGender: (gender) => request(api(idb).selectCategoriesOfGender, gender), // devuelve las categorías pertenecientes a un género en el catálogo
            selectArticlesOfCategoryOfGender: (gender, category) => request(api(idb).selectArticlesOfCategoryOfGender, gender, category), // devuelve los artículos pertenecientes a una categoría perteneciente a un género en el catálogo
            putGender: (gender) => request(api(idb).putGender, gender),
            putCategoryOfGender: (gender, category) => request(api(idb).putCategoryOfGender, gender, category) 
        }
    }

}