import {MusicianTypeResponse} from "./musician_type.response";

export class MusicianResponse {
    uuid;
    firstName;
    lastName;
    age;
    birthDay;
    creationDate;
    avatarUuid;
    hasStartedWithThisBand;
    active;
    types;

    constructor(musician) {
        if (musician){
            this.uuid = musician.uuid;
            this.firstName = musician.firstName;
            this.lastName = musician.lastName;
            this.age = musician.age;
            this.birthDay = musician.birthDay;
            this.creationDate = new Date(musician['creationDateMilliseconds']);
            this.avatarUuid = musician.avatarUuid;
            this.hasStartedWithThisBand = musician.hasStartedWithThisBand;
            this.active = musician.active;
            this.hasAccount = musician.hasAccount;
            this.types = musician.types.map(type => (new MusicianTypeResponse(type)));
        }
    }

}
