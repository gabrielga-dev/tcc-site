export class UserChangePasswordRequest {

    password;
    passwordRepeated;

    constructor(password, passwordRepeated) {
        this.password = password;
        this.passwordRepeated = passwordRepeated;
    }

    isValid() {
        let noneNullAttributes = this.password && this.passwordRepeated;
        let equalAttributes = this.password === this.passwordRepeated;

        return noneNullAttributes && equalAttributes;
    }
}
