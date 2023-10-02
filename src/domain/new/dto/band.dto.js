import {AddressDto} from "./address.dto";

export class BandDto{
    uuid;
    name;
    description;
    address;
    numberOfMusicians;
    numberOfMusics;

    constructor(data) {
        this.uuid = data.uuid;
        this.name = data.name;
        this.description = data.description;
        this.address = new AddressDto(data.address);
        this.numberOfMusicians = data.numberOfMusicians;
        this.numberOfMusics = data.numberOfMusics;
    }
}
