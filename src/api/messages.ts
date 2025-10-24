import postMessageHandler from './handlers/messages/postMessageHandler.ts'

export const sendMessage = async(formEvent:any) => new Promise(async(resolve, reject) => {
    const sender = formEvent.target[0].value;
    const email = formEvent.target[1].value;
    const phone = formEvent.target[2].value;
    const message = formEvent.target[3].value;

    if (sender.length > 0 && message.length > 0) {
        postMessageHandler(sender, message, email, phone)
        .then(result => resolve(result))
        .catch(e => reject(e))
    } else reject("Los campos Nombre y Mensaje son obligatorios")

})