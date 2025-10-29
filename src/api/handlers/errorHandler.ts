export default (err:any) => {
    console.error(err)
    let message;
    try {
        message = err.response.data.message ? err.response.data.message : err.message
    } catch (e) { // no message received (server shutdown?)
        message = err.message ? err.message : err
    } finally {
        if (message === "Network Error") message = "Error de conexión"
        return message
    }
}