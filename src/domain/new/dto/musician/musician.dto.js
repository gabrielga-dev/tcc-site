export class MusicianDto {
    uuid;
    firstName;
    lastName;
    age;
    creationDate;
    avatarUuid;

    constructor(data) {
        this.uuid = data.uuid;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.age = data.age;
        this.creationDate = new Date(data['creationDateMilliseconds']);
        this.avatarUuid = data.avatarUuid;
    }
}
