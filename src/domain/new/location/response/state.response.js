export class StateResponse {

    id;
    name;
    iso2;

    constructor(state = null) {
        if (state){
            this.id = state.id;
            this.name = state.name;
            this.iso2 = state.iso2;
        }
    }
}
