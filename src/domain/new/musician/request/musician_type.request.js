export class MusicianTypeRequest {

    uuid;
    name;

    fromResponse(response){
        this.uuid = response.uuid;
        this.name = response.name;
    }

    constructor(request) {
        if (request) {
            this.uuid = request.uuid;
        }
    }

}
