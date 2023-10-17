import {ContactForm} from "../../form/band/contact.form";

export class ContactDto extends ContactForm {

    constructor(data) {
        super();
        this.type = data.type;
        this.content = data.content;
    }
}
