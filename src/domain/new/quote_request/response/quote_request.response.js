import {QuoteRequestStatusType} from "../quote_request_status.type";

export class QuoteRequestResponse {

    serviceUuid = '';
    quoteUuid = '';
    statusDescription = '';
    status = QuoteRequestStatusType.NON_ANSWERED;
    hiredDateTimestamp = 0;

    constructor(data) {
        if (data){
            this.serviceUuid = data.serviceUuid;
            this.quoteUuid = data.quoteUuid;
            this.statusDescription = data.statusDescription;
            this.status = QuoteRequestStatusType[data.status];
            this.hiredDateTimestamp = data.hiredDateTimestamp;
        }
    }
}
