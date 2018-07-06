const notifier = require('node-notifier');

const notify = (message, title = null) => {
    if (receivingNotifications) {
        notifier.notify({title, message});
    }
}

function showAvailableCommands() {
    console_out(" ")
    console_out(" ============================================================");
    console_out(" = Available Commands =======================================");
    console_out(" ============================================================");
    console_out(" ")
    console_out(" /nick   {arg}  - changes your nickname to arg");
    console_out(" /online        - see who is online");
    console_out(" /me     {arg}  - make a third person emote");
    console_out(" /tfs    {id}   - using work item id a link is produced");
    console_out(" /tn            - toggle notifications on/off");
    console_out(" /roll {num}*   - rolls a 6d die/ce based on num")
    console_out(" ")
    console_out(" = The End ==================================================");
    console_out(" ")
}

module.exports = { notify, showAvailableCommands }
