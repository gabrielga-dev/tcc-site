import {AddressForm} from "../address.form";

export class MusicianForm {
    firstName;
    lastName;
    birthday;
    cpf;
    email;
    address;

    constructor() {
        this.address = new AddressForm();
    }

    getValidations() {
        return [
            {
                'fieldName': 'firstName',
                'translation': 'nome',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 3,
                        'max': 75
                    }
                ]
            },
            {
                'fieldName': 'lastName',
                'translation': 'sobrenome',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 1,
                        'max': 150
                    }
                ]
            },
            {
                'fieldName': 'birthday',
                'translation': 'data de nascimento',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            },
            {
                'fieldName': 'cpf',
                'translation': 'CPF',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 14,
                        'max': 14
                    }
                ]
            },
            {
                'fieldName': 'email',
                'translation': 'email',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 100
                    }
                ]
            },
        ]
    }
}
