const { Status } = require('../../common.js');

class User {
    constructor({ip, computerName, fullName}) {
        this.ip = ip;
        this.computerName = computerName;
        this.fullName = fullName;
        this.nickname = fullName;
        this.status = Status._offline;
        this.displayName = this.generateDisplayName(fullName);
        this.lastWhisperedUser = null;
    }
    setNickname(newNickname) {
        this.nickname = newNickname;
        this.displayName = this.generateDisplayName(newNickname);
    }
    generateDisplayName(newNickname) {
        if (this.computerName) {
            return `${this.computerName} - ${newNickname}`;
        }
        return null;
    }
    changeStatus(newStatus) {
        if (this.status && statusIsValid(newStatus))
            this.status;
        newStatus;
    }
};

function statusIsValid(statusToValidate) {
    return Object.values(Status).filter(status => status === statusToValidate).length;
}

module.exports = User;
