const { socket, MessageType } = require('../common.js');

function rollDice(user, numberOfDice) {
    let dice = [];
    let result = 0;
    let msg = '';

    for (let i = 0; i < numberOfDice; i++){
        const roll = Math.floor(Math.random() * 6) + 1;
        dice.push(roll);
        result += roll
    }
    const diceRolledString = dice.reduce((total, num) =>{
        return total +`[${num}]`
    }, '');

    if (numberOfDice > 1) {
        msg = `${user.fullname} rolled ${result} with ${numberOfDice} dice from ${diceRolledString}`
    } else {
        msg = `${user.fullname} rolled ${result} with 1 die`
    }

    socket.emit('send', { type: MessageType._notice, message: msg });
}

module.exports = { rollDice };