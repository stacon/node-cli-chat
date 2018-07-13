'use strict';
const socketio = require('socket.io');
const { log, NotificationColor } = require('./src/server/functions/log.js');
const { registeredUsers } = require('./src/server/data/registeredUsers.js');
const Server = require('./src/server/models/Server.model.js');
const { MessageType, CommandType, ServerCommand } = require('./src/common.js');

const server = new Server();
let onlineUsers =[];
let onlineUsersMapToSocket = new Map();

// Listen on port 3636
const io = socketio.listen(3636);
log('Server is now online..', NotificationColor._positive);

io.sockets.on('connection', socket => {
    let socketUser = new User();
    const clientUser = fetchRegisteredUserBySocketIP(socket);
    server.onlineUsers = [...server.onlineUsers, clientUser ];

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
            socket.disconnect();
            return;
        }
        clientUser.setNickname(data.user.nickname);
        socketUser = Object.assign(socketUser, data.user,{ socketId: socket.id });
        onlineUsers.push(socketUser);
        onlineUsersMapToSocket.set(socketUser.computerName.toLowerCase(),socket);
        log(`${socketUser.fullname} connected`, NotificationColor._positive);
        const msg = socketUser.fullname + " has joined the chat"
        io.sockets.emit('message', {type: MessageType._notice, message: msg})
    })

    socket.on('server_request', data =>{
        switch  (data.type) {
            case CommandType._online: {
                log(`${socketUser.fullname} requested who is online..`, NotificationColor._notice);
                let onlineUsersToReturn = onlineUsers.reduce((total, user) => `${total}\n  ${user.fullname}`, `  Online Users:\n`);
                socket.emit('message', {type: MessageType._notice, message: onlineUsersToReturn});
                break;
            }

            case CommandType._rename: {
                const {newNickname} = data
                clientUser.setNickname(newNickname);
                const message = socketUser.fullname + " changed their name to " + newNickname;
                log(message, NotificationColor._alert);
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
                log(message, NotificationColor._danger);
                socket.emit('message', {type: MessageType._error, message});
            }

        }
    });

    socket.on('disconnect', () => {
        const message = `${socketUser.fullname} disconnected`;
        log(message, NotificationColor._danger);
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

function fetchRegisteredUserBySocketIP(socket) {
    if (registeredUsers.filter(user => user.ip === getSocketIp(socket)).length === 1) {
        return registeredUsers.filter(user => user.ip === getSocketIp(socket))[0];
    }
    return {};
}

function getSocketIp(socket) {
    return socket.request.connection.remoteAddress.substr(7);
}

function broadcast(broadcastObj) {
    return io.sockets.emit(broadcastObj);
}

// *** Server Commands ***
// /sc terminate    receiver    message
// /sc kick         receiver    message
