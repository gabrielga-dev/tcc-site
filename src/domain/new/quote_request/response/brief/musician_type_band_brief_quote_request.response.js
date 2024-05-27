export class MusicianTypeBriefBandQuoteRequestResponse {

    musicianTypeUuid;
    musicianTypeName;
    quantity;
    observation;

    constructor(data = null) {
        if (data){
            this.musicianTypeUuid = data.musicianTypeUuid;
            this.musicianTypeName = data.musicianTypeName;
            this.quantity = (data.quantity > 0) ? data.quantity : 'Não especificado';
            this.observation = data.observation;
        }
    }
}
