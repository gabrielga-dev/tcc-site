import {MusicBriefBandQuoteRequestResponse} from "./music_brief_band_quote_request.response";
import {MusicianTypeBriefBandQuoteRequestResponse} from "./musician_type_band_brief_quote_request.response";

export class BriefBandQuoteRequestResponse {

    eventUuid;
    description;
    playlist = [];
    wantedMusicianTypes = [];

    constructor(data = null) {
        if (data){
            this.eventUuid = data.eventUuid;
            this.description = data.description;
            this.playlist = data['wantedMusics'].map(m => (new MusicBriefBandQuoteRequestResponse(m)));
            this.wantedMusicianTypes = data['wantedMusicianTypes'].map(
                m => (new MusicianTypeBriefBandQuoteRequestResponse(m))
            );
        }
    }
}
