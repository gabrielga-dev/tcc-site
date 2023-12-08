export class ContactRequest {

    uuid;
    type;
    content;

    constructor(contact=null) {
        if (contact){
            this.uuid = contact.uuid;
            this.type = contact.type;
            this.content = contact.content;
        }else{
            this.uuid = "";
            this.content = "";
        }
    }

    getValidations() {
        return [
            {
                'fieldName': 'content',
                'translation': 'conteúdo',
                'validations': [
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 150
                    }
                ]
            },
            {
                'fieldName': 'type',
                'translation': 'tipo',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            }
        ]
    }
}
