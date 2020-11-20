const { PRIORITY_ABOVE_NORMAL } = require("constants");
const fs = require("fs");
const { PeerServer } = require("peer");
//require("dotenv").config();

const PORT = process.env.PORT || 3001;
console.log(PORT);
const peerServer = PeerServer({
    port: PORT,
    // ssl: {
    //     key: fs.readFileSync(
    //         "/etc/letsencrypt/live/v12.milindsharma.com/privkey.pem"
    //     ),
    //     cert: fs.readFileSync(
    //         "/etc/letsencrypt/live/v12.milindsharma.com/fullchain.pem"
    //     ),
    // },
});
