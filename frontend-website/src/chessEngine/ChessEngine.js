//Code to embed in the webpage

//Start code

function renderBoard(charBoard) {
    var board = ChessBoard('board');
    var game = new Chess();

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
