export default class NotNullValidationUtil {
    type = 'not_null';
    message = 'O campo de {0} não pode ser nulo.';

    getMessage(fieldName, obj){
        return this.message.replace("{0}", fieldName);
    }

    validate(obj, value){
        return !value;
    }
}