export class MusicBriefBandQuoteRequestResponse {

    musicUuid;
    musicName;
    musicAuthor;
    musicArtist;
    observation;
    order;

    constructor(data = null) {
        if (data) {
            this.musicUuid = data.musicUuid;
            this.musicName = data.musicName;
            this.musicAuthor = data.musicAuthor;
            this.musicArtist = data.musicArtist;
            this.observation = data.observation;
            this.order = data.order;
        }
    }

}
