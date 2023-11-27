export class UpdateUserRequest {
    firstName;
    lastName;

    constructor(user = null) {
        if(!!user){
            this.firstName = user.firstName;
            this.lastName = user.lastName;
        }
    }

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
            }
        ]
    }
}
