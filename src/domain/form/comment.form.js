export class CommentForm {
    title;
    content;

    getValidations() {
        return [
            {
                'fieldName': 'title',
                'translation': 'título',
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
                'fieldName': 'content',
                'translation': 'conteúdo',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 5000
                    }
                ]
            },
        ]
    }
}