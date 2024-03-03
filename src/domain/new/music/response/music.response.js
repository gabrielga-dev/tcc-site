export class MusicResponse {
    uuid;
    name;
    author;
    artist;
    observation;
    creationDateTimestamp;
    active;

    constructor(music) {
        if (music) {
            this.uuid = music.uuid;
            this.name = music.name;
            this.author = music.author;
            this.artist = music.artist;
            this.observation = music.observation;
            this.creationDateTimestamp = new Date(music['creationDateTimestamp']);
            this.active = music.active;
        }
    }
}
