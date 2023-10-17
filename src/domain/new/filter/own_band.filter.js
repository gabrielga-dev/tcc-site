export class OwnBandFilter {
    name;
    startDate;
    endDate;

    constructor(){

    }

    toRequestParameters(){
        return [
            this.toParam(this.name, 'name', this.name),
            this.toParam(this.startDate, 'creationDateStartMilliseconds', this.startDate?.getTime() / 1000),
            this.toParam(this.endDate, 'creationDateEndMilliseconds', this.endDate?.getTime() / 1000),
            ].filter(v => (v !== '')).join('&');
    }

    toParam(toCheck, name, value){
        return !!toCheck ? `${name}=${value}` : ''
    }
}
