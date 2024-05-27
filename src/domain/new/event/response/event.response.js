import {AddressResponse} from "../../address/response/address.response";

export class EventResponse {

    uuid;
    name;
    description;
    dateTimestamp;
    active;
    address;

    isActive() {
        const eventDate = new Date(this.dateTimestamp);
        const now = new Date();
        return now <= eventDate;
    }

    constructor(data = null) {
        if (data) {
            this.uuid = data.uuid;
            this.name = data.name;
            this.description = data.description;
            if (data['dateTimeStamp']) {
                this.dateTimestamp = data['dateTimeStamp'];
            }
            if (data.dateTimestamp) {
                this.dateTimestamp = data.dateTimestamp;
            }
            this.active = data.active;
            if (data.address) {
                this.address = new AddressResponse(data.address);
            }
        }
    }
}
