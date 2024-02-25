import {AddressRequest} from "../../address/request/address.request";
import {MusicianTypeRequest} from "./musician_type.request";

export class MusicianRequest {

    firstName = '';
    lastName = '';
    birthday = '';
    cpf = '';
    email = '';
    address = new AddressRequest();
    types = [];

    constructor(request) {
        if (request) {
            this.firstName = request.firstName;
            this.lastName = request.lastName;
            this.birthday = request.birthday;
            this.cpf = request.cpf;
            this.email = request.email;
            this.address = new AddressRequest(request.address);
            this.types = request.types ? request.types.map(type => (new MusicianTypeRequest(type))) : [];
        }
    }

    getValidations() {
        return [
            {
                'fieldName': 'firstName',
                'translation': 'primeiro nome',
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
                'translation': 'data do nascimento',
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
            }
        ];
    }
}
