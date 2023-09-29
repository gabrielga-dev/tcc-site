export class Pagination {
    page = 0;
    quantityPerPage = 0;

    constructor(quantityPerPage = 10) {
        this.quantityPerPage = quantityPerPage;
    }
}