export const DateUtil = {

    DATE_TO_STRING: (date=new Date()) => {
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`
        }
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`
        }
        let year = date.getFullYear();
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${day}/${month}/${year} - ${hour}:${minutes}`;
    },

    DATE_TO_EPOCH: (date) => {
        return date.getTime()
    }
}
