import request from '../../controllers/attributes/selectAllController'
import handleError from '../errorHandler'

import attribute from '@/api/models/Attribute'
import category from '@/api/models/Category'

interface Response {
  attributes: attribute[],
  categories: category[]
}

export const selectAll = async (): Promise<Record<string, any>> => new Promise(async (resolve, reject) => {

  try {

    // Obtener los atributos en formato JSON
    const response: Response = await request()

    // Da formato a la respuesta
    const attributes = Object.assign(new Attributes(response.categories), response.attributes)

    // Devuelve los atributos en formato correcto
    resolve(attributes)

  } catch (err: any) { reject(handleError(err)) }
})

export default selectAll

class Attributes extends Array<attribute> {

  categories: category[]

  constructor(categories: category[]) {
    super()
    this.categories = categories
  }

  filterSlug = (slug?: string) => attributes(super.slice(), this.categories, slug)

}

const attributes = (attributes: attribute[], categories: category[], slug?: string) => {
  const attributesWithSlugs = getAttributesWithSlugs(categories, attributes)
  return slug ?
    attributesWithSlugs.filter((attribute: any) => attribute.slugs.includes(slug))
    : attributesWithSlugs
}

const getAttributesWithSlugs = (categories: category[], attributes: attribute[]) => {

  // Mapa atributoId -> Set de slugs
  const attributeSlugMap = new Map();

  // Inicializar sets
  for (const attr of attributes) {
    attributeSlugMap.set(attr.id, new Set());
  }

  // Recorrer categorías y asociar slugs
  for (const category of categories) {
    for (const attrId of category.attributes) {
      if (attributeSlugMap.has(attrId)) {
        attributeSlugMap.get(attrId).add(category.slug);
      }
    }
  }

  // Construir nuevo objeto
  return attributes.map(attr => ({
    ...attr,
    slugs: Array.from<string>(attributeSlugMap.get(attr.id) || [])
  }))

}