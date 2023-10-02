export class StateDto {
    name;
    code;

    constructor(state) {
        this.name = state.name;
        this.code = state['iso2'];
    }
}
