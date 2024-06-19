import {DateUtil} from "../../../../util/date.util";
import {QuoteRequestStatusType} from "../quote_request_status.type";

export class QuoteRequestCriteria {
    statuses = [];
    startDate;
    endDate;

    constructor(statuses= [QuoteRequestStatusType.NON_ANSWERED.name], startDate, endDate) {
        this.statuses = statuses;
        if (startDate){
            this.startDate = DateUtil.DATE_TO_EPOCH(startDate);
        }
        if (endDate){
            this.endDate = DateUtil.DATE_TO_EPOCH(endDate);
        }
    }

    addStatus(status) {
        this.statuses.push(status.name);
    }

    removeStatus(statusToRemove) {
        this.statuses = this.statuses.filter(status => (status !== statusToRemove.name));
    }

    hasStatus(status){
        return this.statuses.includes(status.name);
    }

    toRequestParameters(){
        return [
            this.toParam(this.statuses, 'statuses', this.statuses),
            this.toParam(this.startDate, 'startDate', this.startDate),
            this.toParam(this.endDate, 'endDate', this.endDate)
        ].filter(v => (v !== '')).join('&');
    }

    toParam(toCheck, name, value){
        return !!toCheck ? `${name}=${value}` : ''
    }
}
