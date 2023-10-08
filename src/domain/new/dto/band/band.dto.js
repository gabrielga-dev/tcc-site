import {AddressDto} from "../address.dto";

export class BandDto{
    uuid;
    name;
    description;
    address;
    profilePictureUuid;
    numberOfMusicians;
    numberOfMusics;

    constructor(data) {
        this.uuid = data.uuid;
        this.name = data.name;
        this.description = data.description;
        this.profilePictureUuid = data.profilePictureUuid;
        this.address = new AddressDto(data.address);
        this.numberOfMusicians = data.numberOfMusicians;
        this.numberOfMusics = data.numberOfMusics;
    }
}
