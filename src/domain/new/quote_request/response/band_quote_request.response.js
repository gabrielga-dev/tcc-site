import {DateUtil} from "../../../../util/date.util";
import {QuoteRequestStatusType} from "../quote_request_status.type";

export class BandQuoteRequestResponse {

    quoteRequestUuid;
    creationDate;
    status;
    eventUuid;

    constructor(data) {
        if (data) {
            this.quoteRequestUuid = data.quoteRequestUuid;
            this.creationDate = DateUtil.DATE_TO_STRING(new Date(data.creationDate));
            this.status = QuoteRequestStatusType[data.status];
            this.eventUuid = data.eventUuid;
        }
    }
}
