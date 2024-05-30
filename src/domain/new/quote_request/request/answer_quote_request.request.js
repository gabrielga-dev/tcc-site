export class AnswerQuoteRequestRequest {

    finalValue;
    observation;
    musicianUuids;

    constructor(finalValue, observation, musicians) {
        this.finalValue = finalValue;
        this.observation = observation;
        this.musicianUuids = musicians.map(m => (m.uuid));
    }
}
