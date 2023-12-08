export class AddressRequest {

    street;
    number;
    neighbour;
    complement;
    cityId;
    stateIso;
    countryIso;
    zipCode;

    constructor(address=null) {
        if(address){
            this.street = address.street;
            this.number = address.number;
            this.neighbour = address.neighbour;
            this.complement = address.complement;
            this.cityId = address.cityId;
            this.stateIso = address.stateIso;
            this.countryIso = address.countryIso;
            this.zipCode = address.zipCode;
        }
    }
}
