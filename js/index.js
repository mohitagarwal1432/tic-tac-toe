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
var GameLevel;
var ClickCount = 0;

/*
##############################################

*****************FOR SLIDER*******************

##############################################
*/
var SlideCounter = 0;
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

/*
##############################################

*****************Player Name & Game Level*******************

##############################################
*/
const savePlayerName = (event, playerID) => {
    event.preventDefault();

    var name = document.getElementById("player" + playerID).value;
    document.getElementById("player" + playerID).value = "";
    console.log(event, playerID, name);

    if (name.length >= 3 && name.length <= 10) {
        PlayerNames[playerID - 1] = name;
        console.log("ok", PlayerNames);
        changeSlide(1);
    } else {
        console.log("Name can only be between 3 to 10 character.");
    }
};

const salectLevel = (event) => {
    event.preventDefault();
    GameLevel = document.getElementById("game-level").value;
    document.getElementById("game-level").value = "1";
    if (GameLevel == 1) {
        MaxRows = 3;
    } else if (GameLevel == 2) {
        MaxRows = 4;
    } else if (GameLevel == 3) {
        MaxRows = 5;
    }
    setGameTable();
    changeSlide(1);
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

//click action function
const playGame = (ele) => {
    ele = ele.srcElement;
    ele.removeEventListener("click", playGame);
    var id = parseInt(ele.id);

    ClickCount++;
    ele.innerHTML = GameSymbols[player];
    result[Math.floor(id / MaxRows)][id % MaxRows] = GameSymbols[player];
    var check = checkResult();
    if (check == 0) {
        player = player ? 0 : 1;
        document.getElementById("turn").innerHTML =
            PlayerNames[player] + "'s turn";
    }
};

const checkResult = () => {
    console.log(result);
    var flag = 1;

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
            gameWinner();
            RemoveClickActionListner();
            console.log("win Row - winner is Player" + (player + 1));
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
            gameWinner();
            console.log("win Column - winner is Player" + (player + 1));
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
        gameWinner();
        console.log("win Diagonal LTR - winner is Player" + (player + 1));
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
        gameWinner();
        console.log("win Diagonal RTL - winner is Player" + (player + 1));
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

const gameWinner = () => {
    var turn = document.getElementById("turn");
    turn.innerHTML = PlayerNames[player] + " won";
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
    setClickAction();
    setPlayerName();
    setDefaultResult();
    player = 0;
    document.getElementById("turn").style = "color:black; font-weight: light";
    document.getElementById("game-level-change").value = GameLevel;
    ClickCount = 0;
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
        PlayerNames[0] + "'s Symbol - " + GameSymbols[0];
    document.getElementById("player2-symbol").innerHTML =
        PlayerNames[1] + "'s symbol - " + GameSymbols[1];
    document.getElementById("turn").innerHTML = PlayerNames[player] + "'s turn";
};

/*
##############################################

*************** GAME CONTROLLS ***************

##############################################
*/
const replayGame = () => {
    setGameTable();
};
const restartGame = () => {
    SlideCounter = 0;
    slider();
};

const changeLevel = () => {
    GameLevel = document.getElementById("game-level-change").value;
    if (GameLevel == 1) {
        MaxRows = 3;
    } else if (GameLevel == 2) {
        MaxRows = 4;
    } else if (GameLevel == 3) {
        MaxRows = 5;
    }
    setGameTable();
};
