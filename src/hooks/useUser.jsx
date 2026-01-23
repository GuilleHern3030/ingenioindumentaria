import { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import String from '@/utils/StringUtils'

const PERMISSIONS = {
    create: 1 << 0, // 1    permite crear
    edit: 1 << 1,   // 2    permite editar
    remove: 1 << 2, // 4    permite eliminar (destroy)
    disable: 1 << 3,// 8    permite deshabilitar / habilitar
    move: 1 << 4,   // 16   permite mover 
    lock: 1 << 5,   // 32   permite bloquear / desbloquear
    view: 1 << 6    // 64   permite ver
} // 

const SECTIONS = {
    categories: 'C',
    attributes: 'A',
    products: 'P',
    variants: 'V',
    messages: 'M',
    workers: 'W', // googlesheet | json
    users: 'U',
}

const decodePermissions = (mask) => {
  const result = {}
  for (const [key, value] of Object.entries(PERMISSIONS))
    result[key] = (mask & value) === value
  return result
}

const getSubstring = (text, caps) => {
    const regex = new RegExp(`${caps}([^A-Z]*)`)
    const match = text.match(regex)
    const chars = match ? match[1] : null
    return chars
}

const getMask = (admin, section) => {
    const sectionChar = SECTIONS[section]
    const chars = getSubstring(admin, sectionChar)
    return String.lettersToNumber(chars)
}

/**
 * Los permisos se definen con una letra mayúscula para establecer la SECCIÓN y una letra minúscula para establecer el PERMISO
 * @param {string} admin Permisos de administrador en formato 'CabAa...'
 * @param {string} section Nombre de la sección donde se quiere consultar el permiso
 * @param {string} permission Nombre del permiso que se quiere consultar
 * @returns {boolean} Devuelve TRUE si el permiso está habilitado
 */
export const permitAllowed = (admin, section, permission) => {
    if (admin === '*') return true
    else try {
        const mask = getMask(admin, section)
        const permissions = decodePermissions(mask)
        return permissions[permission] ?? false
    } catch(e) { }
    return false
}

export default () => {

    const context = useContext(UserContext)

    const hasPermission = (section, permission) => permitAllowed(context.isAdmin, section, permission)

    return { ...context, hasPermission }

}