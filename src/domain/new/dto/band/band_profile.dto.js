import {AddressDto} from "../address.dto";
import {BandForm} from "../../form/band/band.form";
import {ContactForm} from "../../form/band/contact.form";
import {MusicianTypeResponse} from "../../musician/response/musician_type.response";
import {MusicResponse} from "../../music/response/music.response";

export class BandProfileDto {
    uuid;
    name;
    description;
    active;
    profilePictureUuid;
    ownerUuid;
    creationDate;
    musicians;
    musics;
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
            this.musics = data.contributedMusics.map(music => (new MusicResponse(music)))
            this.createdMusicians = data.createdMusicians.map(musician => (new Musician(musician)));
            this.address = new AddressDto(data.address);
            this.contacts = data.contacts.map(contact => (new Contact(contact)));
            this.numberOfMusics = data.numberOfMusics;
        }
    }

    toForm() {
        let form = new BandForm();
        form.name = this.name;
        form.description = this.description;

        form.address = this.address.toForm();

        form.contacts = this.contacts.map(c => (c.toForm()));

        return form;
    }

    removeMusician(musicianUuid) {
        this.musicians = this.musicians.filter(m => m.uuid !== musicianUuid);
    }
}

class Musician {
    uuid;
    firstName;
    lastName;
    avatarUuid;
    age;
    creationDate;
    types;
    hasStartedWithThisBand;
    active;

    constructor(data) {
        this.uuid = data.uuid;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.avatarUuid = data.avatarUuid;
        this.age = data.age;
        this.creationDate = new Date(data['creationDateMilliseconds']);
        this.types = data.types ? data.types.map(type => (new MusicianTypeResponse(type))) : [];
        this.hasStartedWithThisBand = data.hasStartedWithThisBand;
        this.active = data.active;
        this.hasAccount = data.hasAccount;
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

    toForm() {
        let form = new ContactForm();
        form.uuid = this.uuid;
        form.type = this.type;
        form.content = this.content;
        return form;
    }
}
