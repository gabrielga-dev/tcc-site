export class AddressResponse {

    street;
    number;
    neighbour;
    complement;
    city;
    state;
    country;
    zipCode;

    constructor(data) {
        this.street = data.street;
        this.number = data.number;
        this.neighbour = data.neighbour;
        this.complement = data.complement;
        this.city = data.city;
        this.state = data.state;
        this.country = data.country;
        this.zipCode = data.zipCode;
    }

    format(){
        if (this.complement){
            return `${this.street} ${this.number} ${this.complement}, ${this.neighbour}. ${this.city} - ${this.state} (${this.zipCode})`;
        }
        return `${this.street} ${this.number}, ${this.neighbour}. ${this.city} - ${this.state} (${this.zipCode})`;
    }
}
