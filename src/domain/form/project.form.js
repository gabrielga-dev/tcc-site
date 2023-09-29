export class ProjectForm {
    name;
    description;
    maxParticipants;
    projectSituation;
    startDate;
    endDate;

    getValidations() {
        return [
            {
                'fieldName': 'name',
                'translation': 'nome',
                'validations': [
                    {
                        'type': 'size',
                        'min': 5,
                        'max': 100
                    }
                ]
            },
            {
                'fieldName': 'description',
                'translation': 'descrição',
                'validations': [
                    {
                        'type': 'size',
                        'min': 0,
                        'max': 1000
                    }
                ]
            },
            {
                'fieldName': 'maxParticipants',
                'translation': 'máximo de participantes',
                'validations': [
                    {
                        'type': 'positive',
                    }
                ]
            },
            {
                'fieldName': 'projectSituation',
                'translation': 'situação',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            },
            {
                'fieldName': 'startDate',
                'translation': 'data de início',
                'validations': [
                    {
                        'type': 'not_null'
                    }
                ]
            }
        ]
    }
}