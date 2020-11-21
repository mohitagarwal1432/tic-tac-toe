/*
##############################################

***************GAME VARIABLES*****************

##############################################
*/
var player = 0; //can only be 0 or 1, 0 for player_1 and 1 for player_2.
var MaxRows = 3;
var GameSymbols = ["X", "0"]; //X for player_1 and 0 for player_2
var result = []; // to store 0 and X matrix
var TableData; //it will store all td elements
var PlayerNames = [];
PlayerNames[0] = getCookie("PlayerName");

var GameLevel = 1;
var ClickCount = 0;
var isGameTableSet = 0;
var playerNumber;
var GameArenaSlideNumber = 2;

/*
##############################################

*****************FOR SLIDER*******************

##############################################
*/
var SlideCounter = 0;
if (PlayerNames[0]) {
    SlideCounter = 1;
    document.getElementById("UserName").innerHTML = PlayerNames[0];
    //console.log("Yes, name is saved!", PlayerNames, PlayerNames[0]);
} else {
    //console.log("No, name is not saved!", playerNumber, PlayerNames[0]);
}
const slider = () => {
    var slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++) {
        if (SlideCounter < 0) {
            SlideCounter = slides.length - 1;
        }
        if (SlideCounter >= slides.length) {
            SlideCounter = 0;
        }
        slides[i].style.display = "none";
    }
    slides[SlideCounter].style.display = "flex";
};

const changeSlide = (num) => {
    SlideCounter += num;
    slider();
};
slider();

const updateName = () => {
    SlideCounter = 0;
    slider();
};

/*
##############################################

*****************Player Name & Game Level*******************

##############################################
*/
const savePlayerName = (event, playerID) => {
    event.preventDefault();

    var name = document.getElementById("player" + playerID).value;
    document.getElementById("player" + playerID).value = "";
    //console.log(event, playerID, name);

    if (name.length >= 3 && name.length <= 10) {
        PlayerNames[playerID - 1] = name;
        setCookie("PlayerName", name, 1);
        document.getElementById("UserName").innerHTML = PlayerNames[0];
        //console.log("ok", PlayerNames);
        changeSlide(1);
    } else {
        //console.log("Name can only be between 3 to 10 character.");
    }
};
/*
##############################################

*****************GAME RULES*******************

##############################################
*/

//set defalut result
const setDefaultResult = () => {
    for (i = 0; i < MaxRows; i++) {
        result[i] = [];
        for (j = 0; j < MaxRows; j++) {
            result[i][j] = Math.random();
        }
    }
};

const playGame = (ele) => {
    if (playerNumber == player) {
        allowedToPlay(ele);
    }
};

const allowedToPlay = (ele) => {
    ele = ele.srcElement;
    ele.removeEventListener("click", playGame);
    ele.className = "";
    var id = parseInt(ele.id);

    ClickCount++;
    ele.innerHTML = GameSymbols[player];
    result[Math.floor(id / MaxRows)][id % MaxRows] = GameSymbols[player];
    var check = checkResult();
    if (check == 0) {
        if (player == playerNumber) {
            connection.send({
                id: id,
            });
        }
        player = player ? 0 : 1;
        document.getElementById("turn").innerHTML =
            (playerNumber == player ? "Your " : PlayerNames[player] + "'s ") +
            "turn";
    } else {
        document.getElementById("replayGame").style.display = "block";
        if (player == playerNumber) {
            connection.send({
                id: id,
            });
        }
    }
};

const checkResult = () => {
    //console.log(result);
    var flag = 1;
    var i;
    var j;

    //row wise check
    for (i = 0; i < MaxRows; i++) {
        flag = 1;
        for (j = 0; j < MaxRows - 1; j++) {
            if (result[i][j] != result[i][j + 1]) {
                flag = 0;
                break;
            }
        }
        if (flag) {
            gameWinner("ROW", i);
            RemoveClickActionListner();
            //console.log("win Row - winner is Player" + (player + 1));
            return 1;
        }
    }

    //Column wise check
    for (i = 0; i < MaxRows; i++) {
        flag = 1;
        for (j = 0; j < MaxRows - 1; j++) {
            if (result[j][i] != result[j + 1][i]) {
                flag = 0;
                break;
            }
        }
        if (flag) {
            RemoveClickActionListner();
            gameWinner("COL", i);
            //console.log("win Column - winner is Player" + (player + 1));
            return 1;
        }
    }

    //diagonal check LTR
    flag = 1;
    for (i = 0; i < MaxRows - 1; i++) {
        if (result[i][i] != result[i + 1][i + 1]) {
            flag = 0;
            break;
        }
    }
    if (flag) {
        RemoveClickActionListner();
        gameWinner("LTR");
        //console.log("win Diagonal LTR - winner is Player" + (player + 1));
        return 1;
    }

    //diagonal check RTL
    flag = 1;
    for (i = 0; i < MaxRows - 1; i++) {
        if (result[i][MaxRows - 1 - i] != result[i + 1][MaxRows - 1 - i - 1]) {
            //MaxRow-1 i.e 2 in case of 3 rows
            flag = 0;
            break;
        }
    }
    if (flag) {
        RemoveClickActionListner();
        gameWinner("RTL");
        //console.log("win Diagonal RTL - winner is Player" + (player + 1));
        return 1;
    }

    //Checking for tie
    if (ClickCount == MaxRows * MaxRows) {
        RemoveClickActionListner();
        var turn = document.getElementById("turn");
        turn.innerHTML = "DRAW";
        turn.style = "color:RED;font-weight:bolder";
        return 1;
    }

    return 0;
};

const gameWinner = (type, Row_Col) => {
    var line = document.getElementById("hr-line");

    // var height = document.getElementById("table-container").offsetHeight;
    // var width = document.getElementById("table-container").offsetWidth;

    var height = document.getElementById("table-container").scrollHeight;
    var width = document.getElementById("table-container").scrollWidth;
    line.style.width = width - 0 + "px";
    line.style.display = "block";

    var shift = 0;
    var MidRow = (MaxRows - 1) / 2;
    var WidthOfOneRow = width / MaxRows;
    var HeightOfOneRow = height / MaxRows;

    switch (type) {
        case "COL":
            if (Row_Col < MidRow) {
                var lag = MidRow - Row_Col;
                shift = lag * WidthOfOneRow - 5;
            }
            if (Row_Col > MidRow) {
                var excess = Row_Col - MidRow;
                shift = -1 * excess * WidthOfOneRow + 5;
            }
            line.style.transform = `rotate(90deg) translate(53%, ${
                shift + 10
            }px) `;
            break;
        case "ROW":
            if (Row_Col < MidRow) {
                var lag = MidRow - Row_Col;
                shift = lag * HeightOfOneRow - 10;
            }
            if (Row_Col > MidRow) {
                var excess = Row_Col - MidRow;
                shift = -1 * excess * HeightOfOneRow;
            }
            line.style.transform = `rotate(0deg) translate(0px, ${
                height / 2 + 0 - shift
            }px)`;
            break;
        case "RTL":
            // line.style.transform = `rotate(135deg) translate(40%, -${
            //     height / 2 - (GameLevel * 10 + 10)
            // }px) scale(1.25)`;
            line.style.transform = `rotate(135deg) translate(${
                width / 2 - 20 - GameLevel * 10
            }px, -${height / 2 - (GameLevel * 10 + 33)}px) scale(1.25)`;
            break;
        case "LTR":
            line.style.transform = `rotate(45deg) translate(${
                width / 2 - 20 - GameLevel * 10
            }px, ${height / 2 - (GameLevel * 10 + 18)}px) scale(1.25)`;
            break;
    }

    var turn = document.getElementById("turn");
    turn.innerHTML =
        (playerNumber == player ? "You" : PlayerNames[player]) + " won";
    turn.style = "color:green;font-weight:bolder";
};
//Removing Click action after Win
const RemoveClickActionListner = () => {
    for (i = 0; i < TableData.length; i++) {
        TableData[i].removeEventListener("click", playGame);
    }
};

/*
##############################################

*************SETTING GAME TABLE***************

##############################################
*/
var GameTable = document.getElementById("table");
const setGameTable = () => {
    GameTable.innerHTML = "";
    for (i = 0; i < MaxRows; i++) {
        var row = document.createElement("tr");

        for (j = 0; j < MaxRows; j++) {
            var column = document.createElement("td");
            if (Math.ceil((MaxRows * i + (j + 1)) / MaxRows) != MaxRows) {
                column.style.borderBottom = "6px solid #222";
            }
            if (Math.ceil((MaxRows * i + (j + 1)) % MaxRows) != 0) {
                column.style.borderRight = "6px solid #222";
            }
            row.appendChild(column);
        }
        GameTable.appendChild(row);
    }
    init();
};

const init = () => {
    player = 0;
    ClickCount = 0;
    setClickAction();
    setPlayerName();
    setDefaultResult();
    document.getElementById("turn").style = "color:black; font-weight: light";
    document.getElementById("hr-line").style.display = "none";
    document.getElementById("hr-line").style.width = "0px";

    document.getElementById("model").style.display = "none";
    document.getElementById("acceptContainer").style.display = "none";
    document.getElementById("waitingContainer").style.display = "none";
    document.getElementById("replayGame").style.display = "none";
};
//setting onlick action
const setClickAction = () => {
    TableData = document.getElementsByTagName("td");
    for (i = 0; i < TableData.length; i++) {
        TableData[i].id = i;
        TableData[i].addEventListener("click", playGame);
    }
};

//setting player name with gamesymbol
const setPlayerName = () => {
    document.getElementById("player1-symbol").innerHTML =
        (playerNumber ? PlayerNames[0] + "'s " : "Your ") +
        "Symbol - " +
        GameSymbols[0];
    document.getElementById("player2-symbol").innerHTML =
        (playerNumber ? "Your " : PlayerNames[1] + "'s ") +
        "Symbol - " +
        GameSymbols[1];
    document.getElementById("turn").innerHTML =
        (playerNumber ? PlayerNames[0] + "'s" : "Your") + " turn";
};

/*
##############################################

*************** GAME CONTROLLS ***************

##############################################
*/
const replayGame = () => {
    //setGameTable();
    document.getElementById("model").style.display = "block";
    //document.getElementById("acceptContainer").style.display = "none";
    document.getElementById("waitingContainer").style.display = "flex";
    connection.send({
        player: playerNumber,
        replay: true,
    });
};

const acceptReplay = () => {
    setGameTable();
    connection.send({
        isReplayAccepted: true,
    });
};
