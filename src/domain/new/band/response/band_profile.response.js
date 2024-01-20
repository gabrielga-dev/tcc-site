import {AddressResponse} from "../../address/response/address.response";
import {ContactResponse} from "../../contact/response/contact.response";
import {MusicianResponse} from "../../musician/response/musician.response";
import {MusicResponse} from "../../music/response/music.response";

export class BandProfileResponse {
    uuid;
    name;
    description;
    active;
    creationDate;
    profilePictureUuid;
    ownerUuid;
    address;
    contacts;
    musicians;
    contributedMusics;

    constructor(bandProfile) {
        if (bandProfile) {
            this.uuid = bandProfile.uuid;
            this.name = bandProfile.name;
            this.description = bandProfile.description;
            this.active = bandProfile.active;
            this.creationDate = new Date(bandProfile['creationDateMilliseconds']);
            this.profilePictureUuid = bandProfile.profilePictureUuid;
            this.ownerUuid = bandProfile.ownerUuid;
            this.address = new AddressResponse(bandProfile.address);
            this.contacts = bandProfile.contacts.map(contact => (new ContactResponse(contact)));
            this.musicians = bandProfile.musicians.map(musician => (new MusicianResponse(musician)));
            this.contributedMusics = bandProfile.contributedMusics.map(music => (new MusicResponse(music)));
        }
    }
}
