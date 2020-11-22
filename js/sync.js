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
        //peer.disconnect();
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
                //peer.disconnect();
                connectVideoCall(friendsId);
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

// var getUserMedia =
//     navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia;
// getUserMedia(
//     {
//         video: true,
//         audio: true,
//     },
//     function (stream) {
//         var call = peer.call("another-peers-id", stream);
//         call.on("stream", function (remoteStream) {
//             // Show stream in some video/canvas element.
//         });
//     },
//     function (err) {
//         console.log("Failed to get local stream", err);
//     }
// );

const myVideoContainer = document.getElementById("myVideo");
const remoteUserVideoContainer = document.getElementById("remoteUserVideo");
const myVideo = document.createElement("video");
myVideo.muted = true;
var MyStream;
var RemoteUserStream;

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        MyStream = stream;
        console.log("Video Enabled");
        myVideo.srcObject = stream;
        myVideo.addEventListener("loadedmetadata", () => {
            myVideo.play();
        });
        myVideoContainer.appendChild(myVideo);

        peer.on("call", (call) => {
            console.log(
                "When other user call me, this event is triggered, i am not host"
            );
            call.answer(MyStream); //sending him my stream
            var video = document.createElement("video");
            call.on("stream", function (remoteStream) {
                RemoteUserStream = remoteStream;
                //to get remote users strem
                console.log("Stream event triggered.");
                video.srcObject = remoteStream;
                video.addEventListener("loadedmetadata", () => {
                    video.play();
                });
                remoteUserVideoContainer.appendChild(video);
            });
            call.on("close", () => {
                video.remove();
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });

const connectVideoCall = (friendsId) => {
    var call = peer.call(friendsId, MyStream);
    var video = document.createElement("video");
    call.on("stream", function (remoteStream) {
        RemoteUserStream = remoteStream;
        console.log("Stream event triggered.");
        video.srcObject = remoteStream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
        remoteUserVideoContainer.appendChild(video);
    });
    call.on("close", () => {
        video.remove();
    });
};

// peer.on("call", function (call) {
//     navigator.mediaDevices.getUserMedia(
//         { video: true, audio: true },
//         function (stream) {
//             call.answer(stream); // Answer the call with an A/V stream.
//             call.on("stream", function (remoteStream) {
//                 // Show stream in some video/canvas element.
//             });
//         },
//         function (err) {
//             console.log("Failed to get local stream", err);
//         }
//     );
// });

function toggleVideo(ele) {
    MyStream.getVideoTracks()[0].enabled = !MyStream.getVideoTracks()[0]
        .enabled;
    if (MyStream.getVideoTracks()[0].enabled) {
        ele.style.backgroundColor = "rgba(0,0,0,0.7)";
    } else {
        ele.style.backgroundColor = "rgba(255,0,0,0.7)";
    }
}
function toggleAudio(ele) {
    MyStream.getAudioTracks()[0].enabled = !MyStream.getAudioTracks()[0]
        .enabled;
    if (MyStream.getAudioTracks()[0].enabled) {
        ele.style.backgroundColor = "rgba(0,0,0,0.7)";
    } else {
        ele.style.backgroundColor = "rgba(255,0,0,0.7)";
    }
}
