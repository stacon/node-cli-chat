const Status = {
    _offline: 'offline',
    _online: 'online',
    _afk: 'afk',
    _busy: 'busy'
};

registeredUsers = [
    new User({ip: '10.3.23.141', computerName: 'x90586', fullName: 'Stathis C.'}),
    new User({ip: '10.3.23.134', computerName: 'x90584', fullName: 'Bregiannis J'}),
    new User({ip: '10.3.23.133', computerName: 'x90583', fullName: 'Bamides K.'}),
    new User({ip: '10.3.23.136', computerName: 'x90585', fullName: 'Paraskevopoulou A.'}),
    new User({ip: '10.3.23.124', computerName: 'x90582', fullName: 'Kagiema S.'}),
    new User({ip: '10.3.23.127', computerName: 'x90455', fullName: 'Gikas P.'}),
    new User({ip: '10.3.23.132', computerName: 'x89103', fullName: 'Mavraganis V.'})
];

function User(user) {
    this.ip = user.ip;
    this.computerName = user.computerName;
    this.fullname = user.fullName;
    this.nickname = user.fullName;
    this.status = Status._offline;
    this.displayName = generateDisplayName(this.fullname);
    this.lastWhisperedUser = null;

    function changeNickname(newNickname) {
        this.nickname = newNickname;
        generateDisplayName(newNickname);
    };

    function generateDisplayName(newNickname) {
        return `${this.computerName} - ${newNickname}`;
    };

    function changeStatus(newStatus) {
        if (this.status && statusIsValid(newStatus)) this.status = newStatus;
    }
};

const statusIsValid = statusToValidate => {
    return Object.values(Status).filter(status => status === statusToValidate).length;
}