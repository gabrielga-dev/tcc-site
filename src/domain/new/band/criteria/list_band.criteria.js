export class ListBandCriteria {

    name;
    cityId;
    stateIso;
    countryIso;

    constructor(criteria = null) {
        if (criteria){
            this.name = criteria.name;
            this.cityId = criteria.cityId;
            this.stateIso = criteria.stateIso;
            this.countryIso = criteria.countryIso;
        } else {
            this.name = "";
            this.cityId = "";
            this.stateIso = "";
            this.countryIso = "BR";
        }
    }

    toRequestParameters(){
        return [
            this.toParam(this.name, 'name', this.name),
            this.toParam(this.cityId, 'cityId', this.cityId),
            this.toParam(this.stateIso, 'stateIso', this.stateIso),
            this.toParam(this.countryIso, 'countryIso', this.countryIso),
        ].filter(v => (v !== '')).join('&');
    }

    toParam(toCheck, name, value){
        return !!toCheck ? `${name}=${value}` : ''
    }
}
