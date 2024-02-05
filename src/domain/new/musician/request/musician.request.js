import {AddressRequest} from "../../address/request/address.request";
import {MusicianTypeRequest} from "./musician_type.request";

export class MusicianRequest {

    firstName = '';
    lastName = '';
    birthday = '';
    cpf = '';
    email = '';
    address;
    types;

    constructor(request) {
        if (request) {
            this.firstName = request.firstName;
            this.lastName = request.lastName;
            this.birthday = request.birthday;
            this.cpf = request.cpf;
            this.email = request.email;
            this.address = new AddressRequest(request.address);
            this.types = request.types.map(type => (new MusicianTypeRequest(type)));
        } else {
            this.address = new AddressRequest();
            this.types = [];
        }
    }
}
