const User = require('../models/User.model.js'),
    { Status } = require('../../common.js');

const registeredUsers = [
    new User({ip: '10.3.23.141', computerName: 'x90586', fullName: 'Stathis C.'}),
    new User({ip: '10.3.23.134', computerName: 'x90584', fullName: 'Bregiannis J'}),
    new User({ip: '10.3.23.133', computerName: 'x90583', fullName: 'Bamides K.'}),
    new User({ip: '10.3.23.136', computerName: 'x90585', fullName: 'Paraskevopoulou A.'}),
    new User({ip: '10.3.23.124', computerName: 'x90582', fullName: 'Kagiema S.'}),
    new User({ip: '10.3.23.127', computerName: 'x90455', fullName: 'Gikas P.'}),
    new User({ip: '10.3.23.132', computerName: 'x89103', fullName: 'Mavraganis V.'}),
    new User({ip: '10.3.23.76' , computerName: 'x90577', fullName: 'Sanidas G.'}),
    new User({ip: '10.3.23.115', computerName: 'x90579', fullName: 'Fitsilis T.'}),
    new User({ip: '10.3.23.106', computerName: 'x90577', fullName: 'Bairaktaris P.'}),
    new User({ip: '10.3.23.137', computerName: 'x90566', fullName: 'Politis S.'}), 
    new User({ip: '10.3.23.139', computerName: 'x90567', fullName: 'Sandros M.'}),
    new User({ip: '10.3.23.75',  computerName: 'x90576', fullName: 'Patestos A.'}),
    new User({ip: '10.3.23.70',  computerName: 'x90572', fullName: 'Kareliotis N.'}),
    new User({ip: '10.3.23.73',  computerName: 'x90574', fullName: 'Bogdanis P.'}),
];

module.exports = { registeredUsers };
