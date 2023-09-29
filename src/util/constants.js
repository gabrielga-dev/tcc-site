export const Constants = {
    TOKEN: 'token_jwt',
    INTERN_ROLE: 'INTERNO',
    EXTERN_ROLE: 'EXTERNO',

    IS_INTERN_USER: (user) => (user.roles.map(role => (role.name).includes(Constants.INTERN_ROLE))[0]),
}