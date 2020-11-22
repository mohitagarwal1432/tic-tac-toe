/*
##############################################

*****************PEER JS*******************

##############################################
*/

var connection;
var peerid = getCookie("uniqueID");
console.log(peerid);
var peer = new Peer(peerid, {
    // host: "v12.milindsharma.com",
    // port: "3001",
    host: "tic-tac-toe-1432.herokuapp.com",
    port: "",
    secure: true,
});

peer.on("open", function (id) {
    console.log("My ID is: " + id);
    document.getElementById("peerid").innerHTML = id;
    setCookie("uniqueID", id, 1);
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
    alert(
        "You have entered a invalid id or your friend is already connected with someone else."
    );
    document.getElementById("friendsId").value = "";
    console.log(
        "Cannot connect to the friend you are trying to or invalid friend id.",
        err.type
    );
});

peer.on("disconnected", () => {
    console.log(
        "You are no longer accepting connections and no one can connect to you with your id, as it is disabled."
    );
});

const connectionEvents = () => {
    connection.on("data", function (data) {
        if (data.replay) {
            document.getElementById("model").style.display = "block";
            document.getElementById("acceptContainer").style.display = "flex";
        } else if (data.isReplayAccepted) {
            setGameTable();
        } else if (!isGameTableSet) {
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
            SlideCounter = GameArenaSlideNumber;
            slider();
            isGameTableSet = 1;
        } else if (isGameTableSet) {
            if (playerNumber != player) {
                var ele = [];
                ele["srcElement"] = document.getElementById(data.id);
                allowedToPlay(ele);
            }
        }
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
