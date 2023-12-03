export class PaginationRequest {
    page;
    quantityPerPage;

    constructor(quantityPerPage = 10) {
        this.page = 0
        this.quantityPerPage = quantityPerPage;
    }

    toRequestParameters(){
        return `page=${this.page}&size=${this.quantityPerPage}`;
    }
}
