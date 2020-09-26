const Constants = require('../shared/constants');

class ClientBoard{
    constructor(username, x, y, nTiles, gameBoard){
        this.username = username;
        this.x = x;
        this.y = y;
        this.boardSize = gameBoard.length;
        this.background;
        this.tiles = gameBoard;
        this.nTiles = nTiles;
        this.blackR = 0;
        this.blackC = 0;
        this.findBlack();
    }

    makeTiles(){
        var tempTiles = [];
        for(var i = 0; i < colors.length; i++){
            for(var t = 0; t < this.nTiles; t++){
                // only need to store colors of tiles for phaser
                tempTiles.push(new Tile(0, 0, colors[i]));
            }
        }   
        tempTiles.push(new Tile(0,0, "black"));
        shuffle(tempTiles)

        var i = 0
        for(var c = 0; c < this.boardSize; c++){
            var line = [];
            for(var r = 0; r < this.boardSize; r++){
                if(tempTiles[i].color === "black"){
                    this.blackC = c;
                    this.blackR = r;
                }
                line.push(tempTiles[i]);
                i += 1;
            }
            this.tiles.push(line);
        }
    }

    updateTiles(tiles){
        this.tiles = tiles;
    }

    draw(ctx){
        for(var c = 0; c < this.boardSize; c++){
            for(var r = 0; r < this.boardSize; r++){
                var brickX = (c*(Constants.GAME.TILE_WIDTH + Constants.GAME.TILE_PADDING))+this.x;
                var brickY = (r*(Constants.GAME.TILE_HEIGHT + Constants.GAME.TILE_PADDING))+this.y;
                ctx.beginPath();
                ctx.rect(brickX, brickY, Constants.GAME.TILE_WIDTH, Constants.GAME.TILE_HEIGHT);
                ctx.fillStyle = this.tiles[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
        ctx.font = "30px Arial";
            ctx.fillStyle = "black";
        ctx.fillText(this.username, Constants.GAME.TILE_PADDING + this.x, (this.boardSize)*(Constants.GAME.TILE_WIDTH + Constants.GAME.TILE_PADDING)+this.y + 50)
    }

    findBlack(){
        for(var c = 0; c < this.boardSize; c++){
            for(var r = 0; r < this.boardSize; r++){
                if(this.tiles[c][r].color === "black"){
                    this.blackC = c;
                    this.blackR = r;
                }
            }
        }
    }

    moveBlack(c, r){
        var newC = this.blackC + c;
        var newR = this.blackR + r;

        if ((newR < 0) || (newR > (this.boardSize - 1))){
            return;
        } 
        if ((newC < 0) || (newC > (this.boardSize - 1))){
            return;
        }
        
        var oldColor = this.tiles[newC][newR].color;
        this.tiles[this.blackC][this.blackR].color = oldColor;
        this.tiles[newC][newR].color = "black";
        this.blackC = newC;
        this.blackR = newR;
    }
}
module.exports = ClientBoard;