import {AddressDto} from "../address.dto";
import {MusicianDto} from "../musician/musician.dto";
import {ContactDto} from "./contact.dto";

export class OwnBandDto {
    uuid;
    name;
    description;
    active;
    creationDate;
    updateDate;
    profilePictureUuid;
    musicians;
    address;
    contacts;
    numberOfMusics;

    constructor(data) {
        this.uuid = data.uuid;
        this.name = data.name;
        this.description = data.description;
        this.active = data.active;
        this.creationDate = new Date(data['creationDateMilliseconds']);
        this.updateDate = (!!data['updateDateMilliseconds']) ? new Date(data['updateDateMilliseconds']) : null;
        this.profilePictureUuid = data.profilePictureUuid;
        this.musicians = data.musicians.map(m => (new MusicianDto(m)));
        this.address = new AddressDto(data.address);
        this.contacts = data.contacts.map(c => new ContactDto(c));
        this.numberOfMusics = data.numberOfMusics;
    }
}
