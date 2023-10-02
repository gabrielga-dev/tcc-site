export class BandFilter {
    name;
    style;
    state;
    city;
    country = 'BR'

    constructor(){

    }

    toRequestParameters(){
        return [
            this.toParam(this.name, 'name', this.name),
            this.toParam(this.city, 'cityId', this.city?.code),
            this.toParam(this.state, 'stateIso', this.city?.code),
            this.toParam(this.country, 'countryIso', this.country),
            ].filter(v => (v !== '')).join('&');
    }

    toParam(toCheck, name, value){
        return !!toCheck ? `${name}=${value}` : ''
    }
}
