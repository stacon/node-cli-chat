const { computerName } = require('./clientInit.js');

function User(nickname = null)  {
    this.computerName = computerName;
    this.nickname = nickname;
    this.fullname = computerName + ' - ' + nickname;
    this.receivingNotifications = true;
    this.lastWhisperedUser = null;
    this.changeNickName = function (newNickName) {
        this.nickname = newNickName;
        this.fullname = computerName + ' - ' + newNickName;
    }
};

module.exports =  User ;