const User = require('../models/User.js'),
    { Status } = require('../../common.js');

const registeredUsers = [
    new User({ip: '10.3.23.141', computerName: 'x90586', fullName: 'Stathis C.'}),
    new User({ip: '10.3.23.134', computerName: 'x90584', fullName: 'Bregiannis J'}),
    new User({ip: '10.3.23.133', computerName: 'x90583', fullName: 'Bamides K.'}),
    new User({ip: '10.3.23.136', computerName: 'x90585', fullName: 'Paraskevopoulou A.'}),
    new User({ip: '10.3.23.124', computerName: 'x90582', fullName: 'Kagiema S.'}),
    new User({ip: '10.3.23.127', computerName: 'x90455', fullName: 'Gikas P.'}),
    new User({ip: '10.3.23.132', computerName: 'x89103', fullName: 'Mavraganis V.'}),
    new User({ip: '10.0.240.23', computerName: 'x90577', fullName: 'Sanidas G.'})
];

module.exports = { registeredUsers };
