var $tdSelect = $('td');
var $modal = $('#playerSelect');
var playerIcon, computerIcon, choice, board, gameOver;


var gameBoard = document.getElementsByTagName('td');

$(document).ready(function () {
    newGame();
});

$("#reset").click(function() {
    newGame();
});

$('#exes').click(function() {
    playerIcon = 'X';
    computerIcon = 'O';
    $modal.css('display', 'none');
    console.log("player icon = " + playerIcon);
    console.log("computer icon = " + computerIcon);
});

$('#oohs').click(function() {
    playerIcon = 'O';
    computerIcon = 'X';
    $modal.css('display', 'none');
    console.log("player icon = " + playerIcon);
    console.log("computer icon = " + computerIcon);
    makeComputerMove();
});

$tdSelect.click(function() {
    movePos = $(this);
    makeMove(movePos);
})

function newGame() {
    if(gameOver == true) {
        gameOver = false;
        $("#onScreenMessage").text("");
    }

    board = [];
    for(var i = 0; i < gameBoard.length; i++) {
        gameBoard[i].innerHTML = "";
        board.push(gameBoard[i].innerHTML);
    }
    activeTurn = "X";
    $modal.css('display', 'block');
}

function makeMove(movePos) {
    if(!GameOver(board) && activeTurn === playerIcon && movePos.text() === "") {
        movePos.text(playerIcon);
    }
    for(var i = 0; i < gameBoard.length; i++) {
        board[i] = gameBoard[i].innerHTML;
    }
    activeTurn = computerIcon;
    console.log(activeTurn);
    console.log(board);
    makeComputerMove();
}

function makeComputerMove() {
    minimax(board, 0);
    var move = choice;
    board[move] = computerIcon;
    for(var i = 0; i < gameBoard.length; i++) {
        gameBoard[i].innerHTML = board[i];
    }
    choice = [];
    if(!GameOver(board)) {
        activeTurn = playerIcon;
    }
}

function score(game, depth) {
    var score = checkForWinner(game);
    if(score === 1) {
        return 0;
    }
    else if(score === 2) {
        return depth - 10;
    }
    else if(score === 3) {
        return 10 - depth;
    }
}

function minimax(game, depth) {
    if(checkForWinner(game) !== 0) {
        console.log(score(game, depth));
        return score(game, depth);
    }

    depth += 1;
    var scores = new Array();
    var moves = new Array();
    var availableMoves = getAvailableMoves(game);
    var move, possibleGame;
    for(var i = 0; i < availableMoves.length; i++) {
        move = availableMoves[i];
        possibleGame = getNewState(move, game);
        scores.push(minimax(possibleGame, depth));
        moves.push(move);
        game = undoMove(game, move);
    }

    var maxScore, maxScoreIndex, minScore, minScoreIndex;
    if(activeTurn === computerIcon) {
        maxScore = Math.max.apply(Math, scores);
        maxScoreIndex = scores.indexOf(maxScore);
        choice = moves[maxScoreIndex];
        return scores[maxScoreIndex];
    }
    else {
        minScore = Math.min.apply(Math, scores);
        minScoreIndex = scores.indexOf(minScore);
        choice = moves[minScoreIndex];
        return scores[minScoreIndex];
    }
}

function undoMove(game, move) {
    game[move] = "";
    changeTurn();
    return game;
}

function getNewState(move, game) {
    var piece = changeTurn();
    game[move] = piece;
    return game;
}

function changeTurn() {
    var piece;
    if(activeTurn === computerIcon) {
        piece = computerIcon;
        activeTurn = playerIcon;
    }
    else {
        piece = playerIcon;
        activeTurn = computerIcon;
    }
    return piece;
}

function getAvailableMoves(game) {
    var possibleMoves = new Array();
    for(var i = 0; i < gameBoard.length; i++) {
        if(board[i] === "") {
            possibleMoves.push(i);
        }
    }
    return possibleMoves;
}

function checkForWinner(game) {
    // Check for horizontal wins
    for (i = 0; i <= 6; i += 3)
    {
        if (game[i] === playerIcon && game[i + 1] === playerIcon && game[i + 2] === playerIcon)
            return 2;
        if (game[i] === computerIcon && game[i + 1] === computerIcon && game[i + 2] === computerIcon)
            return 3;
    }

    // Check for vertical wins
    for (i = 0; i <= 2; i++)
    {
        if (game[i] === playerIcon && game[i + 3] === playerIcon && game[i + 6] === playerIcon)
            return 2;
        if (game[i] === computerIcon && game[i + 3] === computerIcon && game[i + 6] === computerIcon)
            return 3;
    }

    // Check for diagonal wins
    if ((game[0] === playerIcon && game[4] === playerIcon && game[8] === playerIcon) ||
            (game[2] === playerIcon && game[4] === playerIcon && game[6] === playerIcon))
        return 2;

    if ((game[0] === computerIcon && game[4] === computerIcon && game[8] === computerIcon) ||
            (game[2] === computerIcon && game[4] === computerIcon && game[6] === computerIcon))
        return 3;

    // Check for tie
    for (i = 0; i < gameBoard.length; i++)
    {
        if (game[i] !== playerIcon && game[i] !== computerIcon)
            return 0;
    }
    return 1;
}

function GameOver(game) {
    gameOver = true;
    var alert = $('#onScreenMessage');
    if (checkForWinner(game) === 0)
        return false;
    else if (checkForWinner(game) === 1)
    {
        alert.text("It is a tie.");
    }
    else if (checkForWinner(game) === 2)
    {
        alert.text("You have won! Congratulations!");
    }
    else
    {
        alert.text("The computer has won.");
    }
    return true;
}
