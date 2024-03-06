export class MusicRequest {

    name = '';
    author = '';
    artist = '';
    observation = '';

    fromResponse(request) {
        this.name = request.name;
        this.author = request.author;
        this.artist = request.artist;
        this.observation = request.observation;
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
                        'min': 2,
                        'max': 45
                    }
                ]
            },
            {
                'fieldName': 'author',
                'translation': 'autor',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 2,
                        'max': 60
                    }
                ]
            },
            {
                'fieldName': 'artist',
                'translation': 'artista',
                'validations': [
                    {
                        'type': 'not_null'
                    },
                    {
                        'type': 'size',
                        'min': 2,
                        'max': 60
                    }
                ]
            },
            {
                'fieldName': 'observation',
                'translation': 'observação',
                'validations': [
                    {
                        'type': 'size',
                        'min': 0,
                        'max': 1000
                    }
                ]
            }
        ];
    }
}
