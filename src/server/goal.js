const Board = require('./Board');

class GoalBoard extends Board{
    constructor(x, y, boardSize, nTiles, bg){
        super(x,y, boardSize, nTiles, bg);
        // this.makeTiles();
    }

    makeTiles(){
        var colors = ["red", "yellow", "blue", "white", "orange", "green"];

        var tempTiles = [];
        for(var i = 0; i < colors.length; i++){
            for(var t = 0; t < this.nTiles; t++){
                // only need to store colors of tiles for phaser
                // console.log(colors);
                tempTiles.push(new Tile(0, 0, colors[i]));
            }
        }   
        shuffle(tempTiles)

        // prints out tiles in temp array
        // for(var i = 0; i < tempTiles.length; i++){
        //     console.log(tempTiles[i])
        // }
        // console.log("Break")
        
        var i = 0
        for(var c = 0; c < this.boardSize; c++){
            var line = [];
            for(var r = 0; r < this.boardSize; r++){
                line.push(tempTiles[i]);
                i += 1;
            }
            this.tiles.push(line);
        }

        // console.log("making board:", this.tiles);
        // for(var c = 0; c < this.boardSize; c++){
        //     for(var r = 0; r < this.boardSize; r++){
        //         console.log(this.tiles[c][r]);
        //     }
        // }
        // console.log("Break")
        // console.log(this.tiles)
    }
}

module.exports = GoalBoard;