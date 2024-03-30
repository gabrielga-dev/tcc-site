export class EventResponse {

    uuid;
    name;
    description;
    dateTimestamp;

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
            this.dateTimestamp = data.dateTimestamp;
        }
    }
}
