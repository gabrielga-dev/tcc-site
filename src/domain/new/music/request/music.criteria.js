export class MusicCriteria {

    name = '';
    author = '';
    artist = '';

    isEmpty() {
        return !this.name && !this.author && !this.artist;
    }

    toRequestParameters() {
        return [
            this.toParam(this.name, 'name', this.name),
            this.toParam(this.author, 'author', this.author),
            this.toParam(this.artist, 'artist', this.artist)
        ].filter(v => (v !== '')).join('&');
    }

    toParam(toCheck, name, value) {
        return !!toCheck ? `${name}=${value}` : ''
    }
}
