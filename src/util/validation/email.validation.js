export default class EmailValidationUtil {
    type = 'email';
    message = 'O campo de email deve conter um email válido.';

    getMessage(obj) {
        return this.message;
    }

    validate(obj, value) {
        return !String(value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
}