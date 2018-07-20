const { MessageType } = require('../common.js'),
    { socket } = require('./clientInit.js');

function rollDice(user, numberOfDice) {
    const roll = {}
    roll.dice = [];
    roll.result = 0;
    roll.diceRolledString = '';
    roll.msg = '';

    for (let i = 0; i < numberOfDice; i++){
        const rollOneDie = Math.floor(Math.random() * 6) + 1;
        roll.dice = [ ...roll.dice, rollOneDie];
        roll.result += rollOneDie
    }

    roll.diceRolledString = roll.dice.reduce((total, num) =>{
        return total +`[${num}]`
    }, '');

    if (numberOfDice > 1) {
        roll.msg = `${user.fullname} rolled ${roll.result} with ${numberOfDice} dice from ${roll.diceRolledString}`
    } else {
        roll.msg = `${user.fullname} rolled ${roll.result} with 1 die`
    }

    socket.emit('send', { type: MessageType._notice, message: roll.msg });
}

module.exports = { rollDice };
