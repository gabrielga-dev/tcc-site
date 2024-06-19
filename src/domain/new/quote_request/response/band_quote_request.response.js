import {DateUtil} from "../../../../util/date.util";
import {QuoteRequestStatusType} from "../quote_request_status.type";

export class BandQuoteRequestResponse {

    quoteRequestUuid;
    originQuoteRequestUuid;
    creationDate;
    status;
    eventUuid;
    hired;

    constructor(data) {
        if (data) {
            this.quoteRequestUuid = data.quoteRequestUuid;
            this.originQuoteRequestUuid = data.originQuoteRequestUuid;
            this.creationDate = DateUtil.DATE_TO_STRING(new Date(data.creationDate));
            this.hired = data.hired;
            if (data.hired) {
                this.status = QuoteRequestStatusType.HIRED;
            } else {
                this.status = QuoteRequestStatusType[data.status];
            }
            this.eventUuid = data.eventUuid;
        }
    }
}
