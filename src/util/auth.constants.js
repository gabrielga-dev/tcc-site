export const AuthConstants = {
    TOKEN: 'TOKEN_INFORMATION',
    USER: 'USER_INFORMATION',

    GET_ROLE_NAME: (person) => {
        if (person.roles.some(role => (role.name === 'BAND'))) {
            return 'Responsável por bandas';
        } else if (person.roles.some(role => (role.name === 'MUSICIAN'))) {
            return 'Músico autônomo';
        } else if (person.roles.some(role => (role.name === 'CONTRACTOR'))) {
            return 'Contratante de serviços';
        }
    }
}
