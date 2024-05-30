export class WantedMusicianTypeDto {

    typeUuid = '';
    typeName = '';
    quantityNotSpecified = false;
    wanted = 0;
    current = 0;
    observation = '';

    constructor(data){
        this.typeUuid = data.musicianTypeUuid;
        this.typeName = data.musicianTypeName;
        this.wanted = (!data.quantity) ? 1 : data.quantity;
        this.quantityNotSpecified = (!data.quantity);
        this.current = 0;
        this.observation = data.observation;
    }
}
