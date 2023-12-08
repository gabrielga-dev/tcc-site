import {AddressRequest} from "../../address/request/address.request";

export class BandRequest {

    name = '';
    description = '';
    address = new AddressRequest();
    contacts = [];

    constructor(request = null) {
        if (request) {
            this.name = request.name;
            this.description = request.description;
            this.address = request.address;
            this.contacts = request.contacts;
        }
    }
}
