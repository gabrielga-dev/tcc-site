import {AddressDto} from "../address.dto";
import {BandForm} from "../../form/band/band.form";
import {ContactForm} from "../../form/band/contact.form";

export class BandProfileDto {
    uuid;
    name;
    description;
    active;
    profilePictureUuid;
    ownerUuid;
    creationDate;
    musicians;
    address;
    contacts;
    numberOfMusics;

    constructor(data = null) {
        if (data) {
            this.uuid = data.uuid;
            this.name = data.name;
            this.description = data.description;
            this.active = data.active;
            this.profilePictureUuid = data.profilePictureUuid;
            this.ownerUuid = data.ownerUuid;
            this.creationDate = new Date(data['creationDateMilliseconds']);
            this.musicians = data.musicians.map(musician => (new Musician(musician)));
            this.address = new AddressDto(data.address);
            this.contacts = data.contacts.map(contact => (new Contact(contact)));
            this.numberOfMusics = data.numberOfMusics;
        }
    }

    toForm(){
        let form = new BandForm();
        form.name = this.name;
        form.description = this.description;

        form.address = this.address.toForm();

        form.contacts = this.contacts.map(c => (c.toForm()));

        return form;
    }
}

class Musician {
    uuid;
    firstName;
    lastName;
    age;
    creationDate;

    constructor(data) {
        this.uuid = data.uuid;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.age = data.age;
        this.creationDate = new Date(data.creationDateMilliseconds);
    }
}

class Contact {
    type;
    content;

    constructor(data) {
        this.uuid = data.uuid;
        this.type = data.type;
        this.content = data.content;
    }

    toForm(){
        let form = new ContactForm();
        form.uuid = this.uuid;
        form.type = this.type;
        form.content = this.content;
        return form;
    }
}
