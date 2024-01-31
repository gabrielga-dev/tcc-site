import {AddressForm} from "../form/address.form";

export class AddressDto {
    street;
    neighbour;
    number;
    complement;
    city;
    cityId;
    state;
    country;
    zipCode;

    constructor(data) {
        this.street = data.street;
        this.neighbour = data.neighbour;
        this.number = data.number;
        this.complement = data.complement;
        this.city = data.city;
        this.cityId = data.cityId;
        this.state = data.state;
        this.country = data.country;
        this.zipCode = data.zipCode;
    }

    toForm(){
        let form = new AddressForm();

        form.street = this.street;
        form.neighbour = this.neighbour;
        form.complement = this.complement;
        form.cityId = this.city;
        form.stateIso = this.state;
        form.countryIso = this.country;
        form.zipCode = this.zipCode;

        return form;
    }
}
