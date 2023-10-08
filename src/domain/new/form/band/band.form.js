import {AddressForm} from "../address.form";

export class BandForm {
    name;
    description;
    address;
    contacts;

    constructor() {
        this.address = new AddressForm()
        this.contacts = []
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
        ]
    }
}
