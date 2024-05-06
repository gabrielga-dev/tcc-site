export class QuoteRequestMusicPartRequest {

    musicUuid = '';
    musicName;
    musicArtist;
    observation = '';
    order = 0;

    constructor(music = null) {
        if (music){
            this.musicUuid = music.uuid;
            this.observation = '';
            this.musicName = music.name;
            this.musicArtist = music.artist;
        }
    }
}
