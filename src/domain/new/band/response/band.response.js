import {AddressResponse} from "../../address/response/address.response";

export class BandResponse {

    uuid;
    name;
    description;
    active;
    creationDate;
    updateDate;
    profilePictureUuid;
    address;

    constructor(data) {
        this.uuid = data.uuid;
        this.name = data.name;
        this.description = data.description;
        this.active = data.active;
        this.creationDate = new Date(data['creationDateMilliseconds']);
        this.updateDate = new Date(data['updateDateMilliseconds']);
        this.profilePictureUuid = data.profilePictureUuid;
        this.address = new AddressResponse(data.address);
    }
}
