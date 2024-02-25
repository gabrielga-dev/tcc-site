export class MusicianTypeRequest {

    uuid;

    constructor(request) {
        if (request) {
            this.uuid = request.uuid;
        }
    }

}
