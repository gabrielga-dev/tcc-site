import {MusicianForm} from "../../form/musician/musician.form";

export class MusicianDto {
    uuid;
    firstName;
    lastName;
    age;
    creationDate;
    avatarUuid;

    constructor(data = null) {
        if (data) {
            this.uuid = data.uuid;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.age = data.age;
            this.creationDate = new Date(data['creationDateMilliseconds']);
            this.avatarUuid = data.avatarUuid;
        }
    }

    toForm(){
        let form = new MusicianForm();
        form.firstName = this.firstName;
        form.lastName = this.lastName;
        form.birthday = this.birthday;
        form.cpf = this.cpf;
        form.email = this.email;
    }
}
