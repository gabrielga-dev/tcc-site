export class QuoteRequestMusicianTypeRequest {

    musicianTypeUuid = '';
    musicianTypeName;
    quantity = 0;
    observation = '';

    constructor(musicianType = null) {
        if (musicianType){
            this.musicianTypeUuid = musicianType.uuid;
            this.musicianTypeName = musicianType.name;
        }
    }
}
