export class PageResponse {
    last;
    totalPages;
    totalElements;
    first;
    size;
    number;

    constructor(data = null) {
        if (data) {
            this.last = data.last;
            this.totalPages = data.totalPages;
            this.totalElements = data.totalElements;
            this.first = data.first;
            this.size = data.size;
            this.number = data.number;
        }
    }
}
