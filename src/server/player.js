const Constants = require('../shared/constants')
const Tile = require('../shared/tile');

class Player{
    constructor(id, username, boardSize){
        this.id = id;
        this.username = username;
        this.tiles = this.makeTiles(5);
        // if you wanna add more things to track with each player do so here
        // this.hp = Constants.PLATER_MAX_HP;

    }

    makeTiles(boardSize){
        var colors = ["red", "yellow", "blue", "white", "orange", "green"];
        var nTiles = 4;

        var tempTiles = [];
        for(var i = 0; i < colors.length; i++){
            for(var t = 0; t < nTiles; t++){
                // only need to store colors of tiles for phaser
                tempTiles.push(new Tile(0, 0, colors[i]));
            }
        }   
        tempTiles.push(new Tile(0,0, "black"));
        this.shuffle(tempTiles)

        var tiles = [];
        var i = 0
        for(var c = 0; c < boardSize; c++){
            var line = [];
            for(var r = 0; r < boardSize; r++){
                if(tempTiles[i].color === "black"){
                    this.blackC = c;
                    this.blackR = r;
                }
                line.push(tempTiles[i]);
                i += 1;
            }
            tiles.push(line);
        }

        return tiles;
    }

    updateTiles(tiles){
        this.tiles = tiles;
    }

    shuffle(array) {
        let counter = array.length;
    
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
    
            // Decrease counter by 1
            counter--;
    
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
    
        return array;
    }

    serialize(){
        return {
            id: this.id,
            username: this.username,
            tiles: this.tiles,
        };
    }
}

module.exports = Player;