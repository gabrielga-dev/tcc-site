export default class PositiveValidationUtil {
    type = 'positive';
    message = 'O campo de {0} deve ser positivo (>= 1).';

    getMessage(fieldName, obj){
        return this.message.replace("{0}", fieldName);
    }

    validate(obj, value=''){
        return value <= 0;
    }
}