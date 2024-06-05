import {QuoteRequestStatusType} from "../quote_request_status.type";

export class QuoteRequestResponse {

    serviceUuid = '';
    quoteUuid = '';
    quoteRequestUuid = '';
    statusDescription = '';
    status = QuoteRequestStatusType.NON_ANSWERED;
    price = 0;
    observation = '';

    constructor(data) {
        this.serviceUuid = data.serviceUuid;
        this.quoteUuid = data.quoteUuid;
        this.quoteRequestUuid = data.quoteRequestUuid;
        this.statusDescription = data.statusDescription;
        this.status = QuoteRequestStatusType[data.status];
        this.price = data.price;
        this.observation = data.observation;
    }
}
