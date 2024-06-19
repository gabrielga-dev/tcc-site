export const ToastUtils = {
    BUILD_TOAST_INFO_BODY: (message) => (
        {severity: 'info', summary: 'Atenção', detail: message, life: 3000}
    ),
    BUILD_TOAST_SUCCESS_BODY: (message) => (
        {severity: 'success', summary: 'Sucesso!', detail: message, life: 3000}
    ),
    BUILD_TOAST_ERROR_BODY: (error) => (
        {
            severity: 'error',
            summary: error.response.data.message,
            detail: error.response.data.description.split('\n')[0],
            life: 3000
        }
    ),
    BUILD_TOAST_FORM_ERROR: (title = 'Campos Inválidos!', message) => (
        {severity: 'error', summary: title, detail: message, life: 3000}
    ),
}
