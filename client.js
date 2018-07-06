'use strict'

const { MessageType, CommandType } = require('./src/enums.js')
const { notify, showAvailableCommands } = require('./src/clientFunctions.js')
const readline = require('readline'),
    socketio = require('socket.io-client'),
    color = require("ansi-color").set,
    socket = socketio.connect('http://10.3.23.141:3636'),
    os = require('os'),
    computerName = os.userInfo().username,
    rl = readline.createInterface(process.stdin, process.stdout);

// Notifications appear based on this boolean's value
let receivingNotifications = true;

const user = new User();

rl.question("Please enter a nickname: ", name => {
    user.changeNickName(name);
    socket.emit('connectAnnounce', { type: 'event', user });
    rl.prompt(true);
});



rl.on('line', line => {
    if (line[0] == "/" && line.length > 1) {
        const cmd = line.match(/[a-z]+\b/)[0];
        const arg = line.substr(cmd.length + 2, line.length);
        chat_command(cmd, arg);

    } else {
        // send chat message
        socket.emit('send', { type: 'chat', message: line, nick: user.fullname });
        rl.prompt(true);
    }
});

function chat_command(cmd, arg) {
    switch (cmd) {
        case CommandType._emote:
            const emote = user.fullname + " " + arg;
            socket.emit('send', { type: MessageType._emote, message: emote });
            break;

        case CommandType._tfs:
            socket.emit('send', { type: MessageType._tfs, tfsNumber: arg, nick: user.fullname });
            break;

        case CommandType._whisper:
            socket.emit('send', { type: MessageType._whisper, message: arg });
            break;
        
        case CommandType._rename:
            user.changeNickName(arg)
            socket.emit('server_request', { type: CommandType._rename , newNickname: user.nickname });
            break;

        case CommandType._toggle_notifications:
            receivingNotifications = !receivingNotifications;
            if (receivingNotifications) {
                console_out(color('Notifications turned ON', 'yellow'))
            } else {
                console_out(color('Notifications turned OFF', 'red'))
            }
            break;
        case CommandType._roll:
            if (arg && !isNaN(arg) && arg > 0) {
                rollDice(arg);
            } else {
                rollDice(1);
            }
            break;
        case CommandType._online:
            socket.emit('server_request', {type: CommandType._online});
            break;
        default:
            showAvailableCommands();
    }
}

socket.on('message', data => {
    let leader;

    switch (data.type) {
        case MessageType._chat:
            if (data.nick != user.fullname) {
                leader = color("<" + data.nick + "> ", "green");
                notify(`${data.message}`, `${data.nick} says:`)
                console_out(leader + data.message);
            }
            break;
        case MessageType._whisper:
            //TODO: pluck computerName
            //TODO: if computerName equals this user.computerName console data in purple
            const msg = `Name whispers to you: ${data.message}`;
            console_out(color(msg, 'magenta'));
            break;
        case MessageType._notice:
            console_out(color(data.message, 'cyan'));
            if (data.nick && data.nick != user.fullname) {
                notify(`${data.message}`, `New Notification`)
            }
            break;
        case MessageType._emote:
            console_out(color(data.message, "cyan"));
            if (data.nick != user.fullname) {
                notify(`${data.nick} ${data.message}`)
            }
            break;
        case MessageType._tfs:
            const message = `   TFS WorkItem suggested by ${data.nick}:\n   http://teamfs2010:8080/tfs/DefaultCollection/CBS_UFE/_workitems?id=${data.tfsNumber}`;
            console_out(color(message, 'yellow'));
            if (data.nick != user.fullname) {
                notify(`${data.nick} provided link for TFS: ${message}`, 'TFS Link posted')
            }
            break;
        default:
            null;
    }
});

function User(nickname = null) {
    this.computerName = computerName;
    this.nickname = nickname;
    this.fullname = computerName + ' - ' + nickname;
    this.changeNickName = function (newNickName) {
        this.nickname = newNickName;
        this.fullname = computerName + ' - ' + newNickName;
    }
}

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

function rollDice(numberOfDice) {
    let dice = [];
    let result = 0;
    let msg = '';
    
    for (let i = 0; i < numberOfDice; i++){
        let roll = Math.floor(Math.random() * 6) + 1;
        dice.push(roll);
        result += roll
    }
    const diceRolledString = dice.reduce((total, num) =>{
        return total +`[${num}]`
    }, '')
    
    if (numberOfDice > 1) {
        msg = `${user.fullname} rolled ${result} with ${numberOfDice} dice from ${diceRolledString}`
    } else {
        msg = `${user.fullname} rolled ${result} with 1 die`
    }
    
    socket.emit('send', { type: MessageType._notice, message: msg });
}
