export class EventCriteria {

    name;
    startDate;
    finalDate;
    concluded;
    ownerUuid;

    constructor(userUuid = '') {
        this.name = '';
        this.startDate = null;
        this.finalDate = null;
        this.concluded = null;
        this.ownerUuid = userUuid;
    }

    toRequestParameters(){

        return [
            this.toParam(this.name, 'name', this.name),
            this.toParam(this.startDate, 'startDate', this.startDate),
            this.toParam(this.finalDate, 'finalDate', this.finalDate),
            this.toParam(this.concluded, 'concluded', this.concluded),
            this.toParam(this.ownerUuid, 'ownerUuid', this.ownerUuid),
        ].filter(v => (v !== '')).join('&');
    }

    toParam(toCheck, name, value){
        return !!toCheck ? `${name}=${value}` : ''
    }
}
