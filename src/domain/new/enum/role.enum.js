export const RoleEnum = {
    BAND: 'BAND',
    CONTRACTOR: 'CONTRACTOR',
    MUSICIAN: 'MUSICIAN',
    ANON: 'ANON',

    getFromName: (name = '') => {
        let upName = name.toUpperCase();

        if (upName === 'CONTRATANTE') {
            return RoleEnum.CONTRACTOR;
        } else if (upName === 'BANDA') {
            return RoleEnum.BAND;
        } else if (upName === 'MUSICO') {
            return RoleEnum.MUSICIAN;
        }
        return null;
    }
}
