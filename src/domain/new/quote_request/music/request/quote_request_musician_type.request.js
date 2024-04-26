export class QuoteRequestMusicianTypeRequest {

    musicianTypeUuid = '';
    quantity = 0;
    observation = '';

    constructor(musicianType = null) {
        if (musicianType){
            this.musicianTypeUuid = musicianType.uuid;
        }
    }
}
