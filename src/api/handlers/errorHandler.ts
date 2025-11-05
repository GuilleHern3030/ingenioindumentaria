/*
 *  Cuando el servidor responde con un error, puede pasar 2 cosas
 *      1) El backend responde (existe la key response)
 *      2) El backend no responde (no existe la key response)
 *  Dentro del response se encuentra el objeto 'data' que contiene
 *  la respuesta que da el backend
 * 
 */

class handledError {
    #error;
    constructor(error:Record<string, any>) { this.#error = error }
    toString = () => this.#error.response.data.message
    response = () => this.#error.response.data
    sessionExpired = () => this.response().sessionExpired === true
    adminSessionExpired = () => this.response().adminSessionExpired === true
}

export default (err:any) => {
    console.error(err)

    if (typeof(err) === 'string') {

        return new handledError({ response: { data: { message: err } } })
    
    } else { // object

        if (!err.response) { // El backend no respondió (se crea una respuesta)
            err.response = {
                data: { message: "Error de conexión" }, // Network error
                status: 503,
                statusText: "Service unavailable"
            }
        }

        return new handledError(err)

    }
    
    return err
}