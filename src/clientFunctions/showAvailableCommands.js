const { console_out } = require('../common.js');

function showAvailableCommands() {
    console_out(" ");
    console_out(" ===========================================================================");
    console_out(" = Available Commands ======================================================");
    console_out(" ===========================================================================");
    console_out(" ");
    console_out(" /nick           {arg}   - changes your nickname to arg");
    console_out(" /w {x*****} {message}   - send a private message via computer name");
    console_out(" /r                      - Sends whisper to the last person you whispered to");
    console_out(" /on                     - NEW SHORTER COMMAND: see who is online");
    console_out(" /me             {arg}   - make a third person emote");
    console_out(" /tfs             {id}   - using work item id a link is produced");
    console_out(" /tn                     - toggle notifications on/off");
    console_out(" /roll          {num}*   - rolls a 6d die/ce based on num");
    console_out(" /exit                   - NEW COMMAND: Exits the chat");
    console_out(" ");
    console_out(" = The End =================================================================");
    console_out(" ");
}

module.exports = { showAvailableCommands };
