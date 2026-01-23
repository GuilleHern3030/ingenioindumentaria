import request from '../../controllers/categories/selectAllController'
import handleError from '../errorHandler'

import attribute from '@/api/models/Attribute'
import category from '@/api/models/Category'

interface Response {
  attributes: attribute[],
  categories: category[]
}

/**
 * Obtiene todas las categorías
 * @returns {Categories} Objeto que gestiona las categorías
 */
export const selectAll = async (): Promise<Record<string, any>> => new Promise(async (resolve, reject) => {

  try {

    // Obtener las categorías en formato JSON
    const response: Response = await request()

    // Construir árbol de categorías
    const categoriesTree = buildTree(response.categories, response.attributes)

    // Dar formato a las categorías
    const categories = Object.assign(new Categories(response.attributes), categoriesTree)

    console.log("categories handled:", categories)

    // Devuelve las categorías en formato correcto
    resolve(categories)

  } catch (err: any) { reject(handleError(err)) }
})

export default selectAll

class Categories extends Array<category> {

  attributes: attribute[]

  constructor(attributes: attribute[]) {
    super()
    this.attributes = attributes
  }

}

const buildTree = (categories: category[], attributes: attribute[]) => {

  // Mapa de atributos por id
  const attributeMap = new Map(
    attributes.map(attr => [attr.id, attr])
  );

  const categoryName = (category: category) => {
    const capitalize = (str: string) =>
      str?.length > 0 ?
        str.charAt(0).toUpperCase() + str.slice(1)
        : str
    const name = (category: category) => capitalize(
      category.slug.split("/").pop().replaceAll("-", " ")
    )
    return name(category)
  }

  // Convierte ids de atributos a objetos completos
  const resolveAttributes = (ids: any[]) =>
    ids
      .map(id => attributeMap.get(id))
      .filter(Boolean)
      .map(attr => ({
        id: attr.id,
        name: attr.name,
        disabled: attr.disabled,
        values: [...attr.values].sort((a, b) => a.id - b.id)
      }));

  // Nodo base
  const nodes = new Map();

  // Crear todos los nodos
  for (const cat of categories) {
    nodes.set(cat.slug, {
      slug: cat.slug,
      name: categoryName(cat),
      attributes: resolveAttributes(cat.attributes),
      children: [],
      disabled: cat.disabled
    });
  }

  // Construir jerarquía
  const roots = [];

  for (const cat of categories) {
    const node = nodes.get(cat.slug);
    const parts = cat.slug.split("/");

    if (parts.length === 1) {
      roots.push(node);
    } else {
      const parentSlug = parts.slice(0, -1).join("/");
      const parent = nodes.get(parentSlug);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return roots;
}
