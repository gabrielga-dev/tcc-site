export class AddressRequest {

    street;
    number;
    neighbour;
    complement;
    cityId;
    stateIso;
    countryIso='BR';
    zipCode;

    constructor(address=null) {
        if(address){
            this.street = address.street;
            this.number = address.number;
            this.neighbour = address.neighbour;
            this.complement = address.complement;
            this.cityId = address.cityId;
            this.stateIso = address.stateIso;
            this.countryIso = address.countryIso;
            this.zipCode = address.zipCode;
        } else {
            this.street = '';
            this.number = null;
            this.neighbour = '';
            this.complement = '';
            this.cityId = '';
            this.stateIso = '';
            this.countryIso = 'BR';
            this.zipCode = '';
        }
    }

    getValidations() {
        return [
            {
                'fieldName': 'street',
                'translation': 'rua',
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
                'fieldName': 'number',
                'translation': 'número',
                'validations': [
                    {
                        'type': 'not_null'
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
                    }
                ]
            },
            {
                'fieldName': 'stateIso',
                'translation': 'estado',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            },
            {
                'fieldName': 'countryIso',
                'translation': 'país',
                'validations': [
                    {
                        'type': 'not_null'
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
        ];
    }
}
