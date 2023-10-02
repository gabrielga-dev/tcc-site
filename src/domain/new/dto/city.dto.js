export class CityDto {
    name;
    code;

    constructor(city) {
        this.name = city.name;
        this.code = city.id;
    }
}
