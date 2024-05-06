import {AddressRequest} from "../../address/request/address.request";

export class EventRequest {
    name;
    description;
    address;
    dateTimestamp;

    constructor(data=null) {
        if (data){
            this.name = data.name;
            this.description = data.description;
            this.address = new AddressRequest(data.address);
            this.dateTimestamp = data.dateTimestamp;
        } else {
            this.name = '';
            this.description = '';
            this.address = new AddressRequest();
            this.dateTimestamp = 0;
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
                        'min': 3,
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
                        'min': 3,
                        'max': 500
                    }
                ]
            },
            {
                'fieldName': 'dateTimestamp',
                'translation': 'data',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            }
        ];
    }
}
