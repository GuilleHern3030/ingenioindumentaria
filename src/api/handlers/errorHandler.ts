/*
 *  Cuando el servidor responde con un error, puede pasar 2 cosas
 *      1) El backend responde (existe la key response)
 *      2) El backend no responde (no existe la key response)
 *  Dentro del response se encuentra el objeto 'data' que contiene
 *  la respuesta que da el backend
 * 
 */

import { network_error as en_network_error } from '@/routes/locales/en.json'
import { network_error as es_network_error } from '@/routes/locales/es.json'
import { language } from '@/utils/i18n'
import { clearAdmin } from '../users';
const i18nNetworkError = () => {
    switch(language) {
        case 'es': return es_network_error;
        default: return en_network_error;
    }
}

class handledError {
    #error:any;
    constructor(error:Record<string, any>) { this.#error = error }
    toString = () => this.#error.response.data.message
    response = () => this.#error.response.data
    status = () => this.#error.response.status
    statusText = () => this.#error.response.statusText
    sessionExpired = () => this.response().sessionExpired === true
    adminSessionExpired = () => this.response().adminSessionExpired === true
    isNetworkError = () => this.status() === 503
}

export default (err:any) => {
    console.error(err)

    if (typeof(err) === 'string') {

        return new handledError({ response: { data: { message: err } } })
    
    } else { // object

        if (!err.response) { // El backend no respondió (se crea una respuesta)
            err.response = {
                data: { message: i18nNetworkError() }, // Network error
                status: 503,
                statusText: "Service unavailable"
            }
        }

        if (typeof(err.response.data) === 'string' && err.response.data.includes('DOCTYPE html')) { // El backend devolvió un HTML
            const html = err.response.data
            const match = html.match(/<pre>(.*?)<\/pre>/s); // la 's' permite que . capture saltos de línea
            const message = match ? match[1] : "";
            err.response.data = {
                message: `${message} (${err.response.statusText})`,
                error: html
            }
        }

        if (err.response.status == 403) // forbidden (admin)
            clearAdmin()

        return new handledError(err)

    }
    
    return err
}