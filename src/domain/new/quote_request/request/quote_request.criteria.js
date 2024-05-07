import {DateUtil} from "../../../../util/date.util";

export class QuoteRequestCriteria {
    statuses = [];
    startDate;
    endDate = DateUtil.DATE_TO_EPOCH(new Date());

    constructor(startDate, endDate) {
        if (startDate){
            this.startDate = DateUtil.DATE_TO_EPOCH(startDate);
        }
        if (endDate){
            this.endDate = DateUtil.DATE_TO_EPOCH(endDate);
        }
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
