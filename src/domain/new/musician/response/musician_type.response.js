export class MusicianTypeResponse {
    uuid;
    name;
    description;

    constructor(musicianType) {
        if (musicianType){
            this.uuid = musicianType.uuid;
            this.name = musicianType.name;
            this.description = musicianType.description;
        }
    }
}
