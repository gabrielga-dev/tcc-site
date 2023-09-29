export const ServiceUtils = {
    TO_REQUEST_PARAMS: (obj) => (
        Object.keys(obj)
            .filter(key => (obj[key] != null))
            .map(key => `${key}=${obj[key]}`)
            .join('&')
    ),
}