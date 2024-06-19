import {ServiceType} from "../service.type";
import {QuoteRequestResponse} from "./quote_request.response";

export class QuoteRequestTypeResponse {

    name = '';
    serviceType = ServiceType.BAND;
    quoteRequests = [];

    constructor(data) {
        if (data) {
            this.name = data.name;
            this.serviceType = ServiceType[data['businessType']];
            this.quoteRequests = data.quoteRequests.map(r => (new QuoteRequestResponse(r)));
        }
    }
}
