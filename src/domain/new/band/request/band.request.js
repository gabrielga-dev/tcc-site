import {AddressRequest} from "../../address/request/address.request";

export class BandRequest {

    name = '';
    description = '';
    address = new AddressRequest();
    contacts = [];
    clearProfilePicture = false;

    constructor(request = null) {
        if (request) {
            this.name = request.name;
            this.description = request.description;
            this.address = request.address;
            this.contacts = request.contacts;
        } else {
            this.address = new AddressRequest();
        }
    }

    getValidations() {
        return [
            {
                'fieldName': 'name',
                'translation': 'nome',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 1,
                        'max': 100
                    }
                ]
            },
            {
                'fieldName': 'description',
                'translation': 'descrição',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 500
                    }
                ]
            }
        ];
    }
}
