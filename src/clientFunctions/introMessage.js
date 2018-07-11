const info = require('../../package.json')
const introMessage =
    `Hello and welcome to our cli chat! ver. ${info.version}
 - /r command for fast reply has been temporarily disabled and 
   being reworked on server side. 
     
For more information contact: konstantinos.stathis@alpha.gr
     `;

module.exports = { introMessage };