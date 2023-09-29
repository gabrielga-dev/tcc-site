export class UserForm {
    firstName;
    lastName;
    email;
    intern = false;
    password;

    getValidations() {
        return [
            {
                'fieldName': 'firstName',
                'translation': 'nome',
                'validations': [
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 30
                    }
                ]
            },
            {
                'fieldName': 'lastName',
                'translation': 'sobrenome',
                'validations': [
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 150
                    }
                ]
            },
            {
                'fieldName': 'email',
                'translation': 'email',
                'validations': [
                    {
                        'type': 'size',
                        'min': 8,
                        'max': 100
                    },
                    {
                        'type': 'email'
                    }
                ]
            },
            {
                'fieldName': 'password',
                'translation': 'senha',
                'validations': [
                    {
                        'type': 'size',
                        'min': 8,
                        'max': 100
                    }
                ]
            },
        ]
    }
}