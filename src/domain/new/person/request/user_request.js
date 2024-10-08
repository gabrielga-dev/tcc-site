export class UserRequest {
    firstName = 'testador';
    lastName = 'test test';
    cpf = '984.237.250-22';
    email = 'dealmeida.gabriel.d@gmail.com';
    password = '123456789';
    passwordRepeated = '123456789';

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
                'fieldName': 'cpf',
                'translation': 'CPF',
                'validations': [
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
