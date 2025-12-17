import { admin } from "@/api"

/**
 * Los permisos de administrador se dan por letra minúscula
 * c -> crear
 * e -> edición
 * d -> deshabilitar|habilitar
 * r -> remover
 * m -> mover
 * Mientras que la sección en donde se está definiendo el permiso se da por una letra mayúscula
 * C -> Categorías
 * A -> Atributos
 * P -> Productos
 * V -> Variantes
 * M -> Mensajes
 * W -> Workers
 * Finalmente, el formato final será, por ejemplo: 
 * 'C:edr|A:ed|P:edrm|M:r|W:'
 */
const permissions = () => {
    const roleText = admin() || ''
    const role = {}

    roleText.split('|').forEach(block => {
        if (!block) return

        const [ section, perms = '' ] = block.split(':')

        switch (section) {
            case 'C': { role['categories'] = perms.split(''); break; }
            case 'A': { role['attributes'] = perms.split(''); break; }
            case 'P': { role['products'] = perms.split(''); break; }
            case 'V': { role['variants'] = perms.split(''); break; }
            case 'M': { role['messages'] = perms.split(''); break; }
            case 'W': { role['workers'] = perms.split(''); break; }
        }
    })

    return {
        create: (section:string):boolean => role[section]?.includes('c') || roleText === '*',
        edit: (section:string):boolean => role[section]?.includes('e') || roleText === '*',
        disable: (section:string):boolean => role[section]?.includes('d') || roleText === '*',
        enable: (section:string):boolean => role[section]?.includes('d') || roleText === '*',
        remove: (section:string):boolean => role[section]?.includes('r') || roleText === '*',
        move: (section:string):boolean => role[section]?.includes('m') || roleText === '*',
    }
}

/**
 * 
 * @param section section for which you want to know if there are permissions
 * @param permission permit name
 */
export const hasPermission = () => {
    return permissions()
}

export default hasPermission