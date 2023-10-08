export class AddressForm {
    street;
    neighbour;
    complement;
    cityId;
    stateIso;
    countryIso;
    zipCode;

    constructor() {
        this.countryIso = 'BR';
    }

    getValidations() {
        return [
            {
                'fieldName': 'street',
                'translation': 'Rua e Número',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 3,
                        'max': 50
                    }
                ]
            },
            {
                'fieldName': 'neighbour',
                'translation': 'bairro',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 3,
                        'max': 50
                    }
                ]
            },
            {
                'fieldName': 'complement',
                'translation': 'complemento',
                'validations': [
                    {
                        'type': 'size',
                        'min': 3,
                        'max': 10
                    }
                ]
            },
            {
                'fieldName': 'cityId',
                'translation': 'cidade',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                ]
            },
            {
                'fieldName': 'stateIso',
                'translation': 'estado',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 2,
                        'max': 2
                    }
                ]
            },
            {
                'fieldName': 'zipCode',
                'translation': 'CEP',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 25
                    }
                ]
            }
        ]
    }
}
