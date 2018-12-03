/* Written by Michael Beshear
   Chess engine integration with chess.js and chessboard.js
   for a chess by mail server.
   Requires both chess.js and chessboard.js to function
 */

//Board rendering the chess game
var board = ChessBoard('board');
//Chess game
var game = new Chess();
//Color of the person viewing the board
var color = 'w';

//Renders a fen string board
function renderFenBoard(fenBoard) {
    //Clears current game
    game.clear();
    //Loads the fen position
    game.load(fenBoard);
    //Renders the game
    board.position(game.fen());
}

//Renders a 2d char array board
function renderCharBoard(charBoard) {
    //Clear board to make new chess game
    game.clear();

    //Convert from 2d char array to Chess.js game
    for(x = 0; x < 8; x++){
        for(y = 0; y < 8; y++){
            var row = intToCol(x);
            var pos = row + y;
            switch(charBoard[x][y]){
                //Black Pieces
                case 'p':
                    game.put({type:'p', color:'b'}, pos);
                    continue;
                case 'n':
                    game.put({type:'n', color:'b'}, pos);
                    continue;
                case 'b':
                    game.put({type:'b', color:'b'}, pos);
                    continue;
                case 'r':
                    game.put({type:'r', color:'b'}, pos);
                    continue;
                case 'q':
                    game.put({type:'q', color:'b'}, pos);
                    continue;
                case 'k':
                    game.put({type:'k', color:'b'}, pos);
                    continue;

                //White Pieces
                case 'P':
                    game.put({type:'p', color:'w'}, pos);
                    continue;
                case 'N':
                    game.put({type:'n', color:'w'}, pos);
                    continue;
                case 'B':
                    game.put({type:'b', color:'w'}, pos);
                    continue;
                case 'R':
                    game.put({type:'r', color:'w'}, pos);
                    continue;
                case 'Q':
                    game.put({type:'q', color:'w'}, pos);
                    continue;
                case 'K':
                    game.put({type:'k', color:'w'}, pos);
                    continue;
            }
        }
    }

    board.position(game.fen());
}

//Converts an integer to a column index on a chess board
function intToCol(i){
    switch (i) {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
        case 6:
            return 'g';
        case 7:
            return 'h';
    }
}

//Sets the color of the player viewing the board
// 'w' for white, 'b' for black
function setColor(newColor){
    color = newColor;
}

var onDragStart = function (source, piece) {
    //Stops movement if the game is over
    if(game.game_over()){
        return false;
    }

    //Stops move if the person viewing the board has moved
    if(game.turn() !== color){
        return false;
    }

    //Stops move if the mover is moving the opposite color
    if(color === 'w' && piece.search(/^b/) !== -1){
        return false;
    }
    if(color === 'b' && piece.search(/^w/) !== -1){
        return false;
    }
};

var onDrop = function (source, target) {
    //Saves the just made move as a chess.js move
    //TODO add promotion options
    //Also makes the move on the chess.js game
    var move = game.move({from: source, to:target, promotion: 'q'});

    //Checks if move is legal
    if (move === null) {
        //Return piece to position before move
        return 'snapback';
    }
};