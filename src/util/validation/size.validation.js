export default class SizeValidationUtil {
    type = 'size';
    message = 'O campo de {0} deve ter de {1} até {2} caracteres.';

    getMessage(fieldName, obj){
        let {min, max} = obj;
        let result = this.message.replace("{0}", fieldName);
        result = result.replace("{1}", min);
        result = result.replace("{2}", max);
        return result;
    }

    validate(obj, value=''){
        let {min, max} = obj;
        return !((min <= value.length) && (value.length <= max))
    }
}