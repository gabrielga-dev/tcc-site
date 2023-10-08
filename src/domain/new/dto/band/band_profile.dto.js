import {AddressDto} from "../address.dto";

export class BandProfileDto {
    uuid;
    name;
    description;
    active;
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
            this.creationDate = new Date(data.creationDateMilliseconds);
            this.musicians = data.musicians.map(musician => (new Musician(musician)));
            this.address = new AddressDto(data.address);
            this.contacts = data.contacts.map(contact => (new Contact(contact)));
            this.numberOfMusics = data.numberOfMusics;
        }
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
        this.type = data.type;
        this.content = data.content;
    }
}
