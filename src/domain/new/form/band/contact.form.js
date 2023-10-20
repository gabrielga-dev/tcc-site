export class ContactForm {
    uuid;
    type;
    content;

    getValidations() {
        return [
            {
                'fieldName': 'type',
                'translation': 'tipo',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            },
            {
                'fieldName': 'content',
                'translation': 'conteúdo',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 150
                    }
                ]
            }
        ]
    }
}
