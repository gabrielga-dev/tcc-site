import EmailValidationUtil from "./email.validation";
import SizeValidationUtil from "./size.validation";
import PositiveValidationUtil from "./positive.validation";
import NotNullValidationUtil from "./not_null.validation";

export default class ValidationUtil {
    validators = [
        new EmailValidationUtil(),
        new SizeValidationUtil(),
        new PositiveValidationUtil(),
        new NotNullValidationUtil(),
    ];

    validate(form){
        let errors = [];
        let validationRecipe = form.getValidations();
        validationRecipe.forEach(
            validationPart => {
                validationPart.validations.forEach(
                    validation => {
                        let validator = this.getValidation(validation.type)
                        if (validator.validate(validation, form[validationPart.fieldName])){
                            errors.push(validator.getMessage(validationPart.translation, validation))
                        }
                    }
                )
            }
        );
        return errors;
    }

    getValidation(type){
        return this.validators.filter(validator => (validator.type === type))[0]
    }
}