'use strict';
const socketio = require('socket.io');
const { MessageType, CommandType, ServerCommand, color } = require('./src/common.js');

let onlineUsers =[];
let onlineUsersMapToSocket = new Map();

// Listen on port 3636
const io = socketio.listen(3636);
console.log(color(`Server is now online..`,'yellow'));

io.sockets.on('connection', socket => {
    let socketUser = new User();

    socket.on('send', data => {
        if (data.type === MessageType._whisper) {
            const { receiverComputerName, message, type } = data;
            if (!onlineUsersMapToSocket.get(receiverComputerName)) {
                socket.emit('message', {type: MessageType._notice, message: `Receiver ${receiverComputerName} not found!`})
                return;
            }
            onlineUsersMapToSocket.get(receiverComputerName).emit('message', {type, message, senderFullName: socketUser.fullname})
        } else {
            io.sockets.emit('message', data);
        }
    });
    
    socket.on('connectAnnounce', data => {

        if(onlineUsers.filter(user => user.computerName === data.user.computerName).length > 0) {
            const message = 'You are already logged in the chat';
            const command = ServerCommand._terminate;
            socket.emit('message', {type: MessageType._serverCommand, message, command});
            return;
        }
        socketUser = Object.assign(socketUser,data.user,{ socketId: socket.id });
        onlineUsers.push(socketUser);
        onlineUsersMapToSocket.set(socketUser.computerName.toLowerCase(),socket);
        console.info(color(`${socketUser.fullname} connected`, 'green'));
        const msg = socketUser.fullname + " has joined the chat"
        io.sockets.emit('message', {type: MessageType._notice, message: msg})
    })

    socket.on('server_request', data =>{
        switch  (data.type) {
            case CommandType._online: {
                console.log(color(`${socketUser.fullname} requested who is online..`, 'yellow'));
                let onlineUsersToReturn = onlineUsers.reduce((total, user) => `${total}\n  ${user.fullname}`, `  Online Users:\n`);
                socket.emit('message', {type: MessageType._notice, message: onlineUsersToReturn});
                break;
            }

            case CommandType._rename: {
                const {newNickname} = data
                const message = socketUser.fullname + " changed their name to " + newNickname;
                console.log(color(message, 'yellow'));
                io.sockets.emit('message', {type: MessageType._notice, message});
                onlineUsers = onlineUsers.map(user => {
                    if (user.fullname === socketUser.fullname)
                        user.fullname = socketUser.computerName.toLowerCase() + ' - ' + newNickname;
                    return user;
                });
                socketUser.changeNickName(newNickname);
                break;
            }
            case CommandType._serverCommand: {
                if(socketUser.computerName === 'x90586') { //If Stacon
                    const { option, target, message } = data;
                    if (!target || target === 'all') {
                        io.sockets.emit('message', {type: MessageType._serverCommand, option, message})
                        break;
                    }
                    onlineUsersMapToSocket.get(target).emit('message', {type: MessageType._serverCommand, option, message});
                    break;
                }
            }
            default: {
                const message = 'Server Request invalid';
                console.log(color(message, 'red'));
                socket.emit('message', {type: MessageType._error, message});
            }

        }
    });

    socket.on('disconnect', () => {
        const message = `${socketUser.fullname} disconnected`;
        console.log(color(message, 'red'));
        if (socketUser.fullname !== undefined) {
            io.sockets.emit('message', {type: MessageType._notice, message });
        }
        onlineUsers = onlineUsers.filter(user => user.nickname !== socketUser.nickname);
    })
});

function User(nickname = null, computerName = null) {
    this.nickname = nickname;
    if(computerName){
        this.computerName = computerName.toLowerCase();
    }
    else {
        this.computerName = computerName;
    }
    this.changeNickName = (newNickName) => {
        this.nickname = newNickName.trim();
        this.fullname = this.computerName.toLowerCase() + ' - ' + newNickName;
    }
}

// *** Server Commands ***
// /sc terminate    receiver    message
// /sc kick         receiver    message
