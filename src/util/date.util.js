export const DateUtil = {

    DATE_TO_STRING: (date) => {
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`
        }
        let month = date.getMonth();
        if (month < 10) {
            month = `0${month}`
        }
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    DATE_TO_EPOCH: (date) => {
        return date.getTime()
    }
}
