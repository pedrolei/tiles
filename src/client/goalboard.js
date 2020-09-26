const ClientBoard = require('./clientboard');

class GoalBoard extends ClientBoard{
    constructor(x, y, nTiles, gameBoard){
        super("", x, y, nTiles, gameBoard);
    }

    makeTiles(){
        var tempTiles = [];
        for(var i = 0; i < colors.length; i++){
            for(var t = 0; t < this.nTiles; t++){
                // only need to store colors of tiles for phaser
                tempTiles.push(new Tile(0, 0, colors[i]));
            }
        }   
        shuffle(tempTiles)
        var i = 0
        for(var c = 0; c < this.boardSize; c++){
            var line = [];
            for(var r = 0; r < this.boardSize; r++){
                line.push(tempTiles[i]);
                i += 1;
            }
            this.tiles.push(line);
        }
    }
}

module.exports = GoalBoard;