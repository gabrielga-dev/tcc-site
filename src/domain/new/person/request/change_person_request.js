export class ChangePersonRequest {
    newEmail;

    isValid() {
        if (!this.newEmail) {
            return false;
        } else if ((this.newEmail.length < 8) || (this.newEmail.length > 100)) {
            return false;
        }
        return true;
    }
}
