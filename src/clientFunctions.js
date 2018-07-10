const notifier = require('node-notifier'),
readline = require('readline'),
socketio = require('socket.io-client'),
os = require('os'),
socket = socketio.connect('http://10.3.23.141:3636'),
computerName = os.userInfo().username.toLowerCase(),
{ ServerCommand, color } = require('./common.js');

rl = readline.createInterface(process.stdin, process.stdout);

const notify = (receivingNotifications, message, title = null) => {
    if (receivingNotifications) {
        notifier.notify({title, message});
    }
}

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

function showAvailableCommands() {
    console_out(" ")
    console_out(" ===========================================================================");
    console_out(" = Available Commands ======================================================");
    console_out(" ===========================================================================");
    console_out(" ")
    console_out(" /nick           {arg}   - changes your nickname to arg");
    console_out(" /w {x*****} {message}   - send a private message via computer name")
    console_out(" /r                      - Sends whisper to the last person you whispered to");
    console_out(" /on                     - NEW SHORTER COMMAND: see who is online");
    console_out(" /me             {arg}   - make a third person emote");
    console_out(" /tfs             {id}   - using work item id a link is produced");
    console_out(" /tn                     - toggle notifications on/off");
    console_out(" /roll          {num}*   - rolls a 6d die/ce based on num");
    console_out(" /exit                   - NEW COMMAND: Exits the chat")
    console_out(" ")
    console_out(" = The End =================================================================");
    console_out(" ")
}

function executeServerCommand(commandInfo) {
    const { option, message } = commandInfo
    switch (option) {
        case ServerCommand._terminate: {
            console_out(color(message, 'red'));
            process.exit(1);
            break;
        }
        case ServerCommand._kick: {
            console_out(color(message, 'red'));
            process.exit(1);
            break;
        }
    }

}

module.exports = { notify, showAvailableCommands, console_out, rl, socket, computerName, executeServerCommand }
