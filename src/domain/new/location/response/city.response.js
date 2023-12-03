export class CityResponse {

    id;
    name;

    constructor(city = null) {
        if (city){
            this.id = city.id;
            this.name = city.name;
        }
    }
}
