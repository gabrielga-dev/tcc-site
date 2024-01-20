export class ContactResponse {

    uuid;
    type;
    content;

    constructor(contact) {
        if (contact) {
            this.uuid = contact.uuid;
            this.type = contact.type;
            this.content = contact.content;
        }
    }
}
