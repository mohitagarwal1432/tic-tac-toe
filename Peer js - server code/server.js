const fs = require("fs");
const { PeerServer } = require("peer");

const peerServer = PeerServer({
    port: 3001,
    ssl: {
        key: fs.readFileSync(
            "/etc/letsencrypt/live/v12.milindsharma.com/privkey.pem"
        ),
        cert: fs.readFileSync(
            "/etc/letsencrypt/live/v12.milindsharma.com/fullchain.pem"
        ),
    },
});
