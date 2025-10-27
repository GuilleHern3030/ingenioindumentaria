export default (err:any) => {
    console.error(err)
    try {
        return err.response.data.message ? err.response.data.message : err.message
    } catch (e) { // no message received (server shutdown?)
        return err.message ? err.message : err
    }
}