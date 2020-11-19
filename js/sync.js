/*
##############################################

*****************PEER JS*******************

##############################################
*/

var connection;
var peer = new Peer(undefined, {
    host: "v12.milindsharma.com",
    port: "3001",
});

peer.on("open", function (id) {
    console.log("My peer ID is: " + id);
    document.getElementById("peerid").innerHTML = id;
});

peer.on("connection", function (conn) {
    connection = conn;
    //them call peer.disconnect() to stop incomming of new connections and resume call peer.reconnect()
    connection.on("open", function () {
        console.log("Your Friend accepted your invitation!");
        // Receive messages
        connectionEvents();
        peer.disconnect();
        connection.send({
            host: false,
            name: PlayerNames[0],
            playerNumber: 0,
        });
    });
});

peer.on("error", function (err) {
    alert("Invalid id. try again");
    document.getElementById("friendsId").value = "";
    console.log(
        "Cannot connect to the friend you are trying to or invalid friend id.",
        err.type
    );
});

peer.on("disconnected", () => {
    console.log(
        "You are no longer accepting connections and no one can connect to you with your peer id, as it is disabled."
    );
});

const connectionEvents = () => {
    connection.on("data", function (data) {
        if (data.replay) {
            document.getElementById("model").style.display = "block";
            document.getElementById("acceptContainer").style.display = "flex";
        }
        if (data.isReplayAccepted) {
            setGameTable();
        }
        if (!isGameTableSet) {
            if (data.host) {
                var name = PlayerNames[0];
                PlayerNames[0] = data.name;
                PlayerNames[1] = name;
                playerNumber = data.playerNumber;
            } else {
                PlayerNames[1] = data.name;
                playerNumber = data.playerNumber;
            }
            setGameTable();
            changeSlide(1);
            isGameTableSet = 1;
        }
        if (isGameTableSet) {
            var ele = [];
            ele["srcElement"] = document.getElementById(data.id);
            allowedToPlay(ele);
        }
        console.log("Received: ", data);
    });
    connection.on("close", function () {
        console.log("Your friend disconnected!");

        setTimeout(() => {
            var disconnected = confirm(
                `${PlayerNames[playerNumber ? 0 : 1]} disconnected.`
            );
            location.reload();
        }, 2000);
    });

    connection.on("error", function (err) {
        console.log("Error!");
    });
};

const connectTOFriend = (event) => {
    event.preventDefault();
    var friendsId = document.getElementById("friendsId").value;
    if (peer.id !== friendsId) {
        connection = peer.connect(friendsId);
        if (connection) {
            connection.on("open", function () {
                console.log("Connection Established!");
                // Receive messages
                connectionEvents();
                peer.disconnect();

                connection.send({
                    host: true,
                    name: PlayerNames[0],
                    playerNumber: 1,
                });
            });
        }
    } else {
        alert("You cannot connect with self.");
        document.getElementById("friendsId").value = "";
    }
};