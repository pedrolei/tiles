class Board{
    constructor(x, y, boardSize, nTiles, bg){
        this.x = x;
        this.y = y;
        this.boardSize = boardSize;
        this.background = bg;
        this.tiles = [];
        this.nTiles = nTiles;
        this.blackR = 0;
        this.blackC = 0;
        this.makeTiles();
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
        tempTiles.push(new Tile(0,0, "black"));
        this.shuffle(tempTiles)

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

    draw(ctx){
        for(var c = 0; c < this.boardSize; c++){
            for(var r = 0; r < this.boardSize; r++){
                // tile = board[c][r]
                var brickX =  (c*(brickWidth+brickPadding))+this.x;
                var brickY = (r*(brickHeight+brickPadding))+this.y;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // console.log(this.tiles[c][r])
                ctx.fillStyle = this.tiles[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    moveBlack(c, r){
        // console.log("Calling move");
        var newC = this.blackC + c;
        var newR = this.blackR + r;

        // console.log(newR);
        // console.log(newC);
        // console.log(this.boardSize)
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

        // for(var c = 0; c < this.boardSize; c++){
        //     for(var r = 0; r < this.boardSize; r++){
        //         console.log(this.tiles[c][r]);
        //     }
        // }
        // console.log("Break")
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
}

module.exports = Board;