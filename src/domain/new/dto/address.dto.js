export class AddressDto {
    street;
    neighbour;
    complement;
    city;
    state;
    country;
    zipCode;

    constructor(data) {
        this.street = data.street;
        this.neighbour = data.neighbour;
        this.complement = data.complement;
        this.city = data.city;
        this.state = data.state;
        this.country = data.country;
        this.zipCode = data.zipCode;
    }
}
