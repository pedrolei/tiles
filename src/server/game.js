const Constants = require('../shared/constants');
const Player = require('./player');
const Tile = require('../shared/tile');

class Game {
    constructor(id){
        this.id = id;
        this.sockets = {};
        this.players = {};
        // this.boards = [];
        this.goal = this.makeGoal(3);
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;

        // set interval loop used to go here, but it will now go in 
        // start game function
    }

    addPlayer(socket, username){
        this.sockets[socket.id] = socket;
        this.players[socket.id] = new Player(socket.id, username);
    }
    
    removePlayer(socket){
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    makeGoal(boardSize){
        var colors = ["red", "yellow", "blue", "white", "orange", "green"];
        var nTiles = 4

        var tempTiles = [];
        for(var i = 0; i < colors.length; i++){
            for(var t = 0; t < nTiles; t++){
                // only need to store colors of tiles for phaser
                // console.log(colors);
                tempTiles.push(new Tile(0, 0, colors[i]));
            }
        }   
        this.shuffle(tempTiles)
        
        var tiles = [];
        var i = 0
        for(var c = 0; c < boardSize; c++){
            var line = [];
            for(var r = 0; r < boardSize; r++){
                line.push(tempTiles[i]);
                i += 1;
            }
            tiles.push(line);
        }
        
        return tiles;
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
        
    startGame(){
        // TODO: think about whether its better that both players have the same board

        // players build their boards on intiialization
        // goal is built upon game initialization
        console.log("Starting game for these players:");
        Object.keys(this.sockets).forEach(playerID =>{
            console.log(playerID);
            const socket = this.sockets[playerID];
            const p = this.players[playerID];
            const goal = this.goal;
            const opponents = []

            Object.keys(this.sockets).forEach(opponentID =>{
                if(playerID != opponentID){
                    opponents.push(this.players[opponentID]);
                }
            });
            
            // sends update over the socket
            socket.emit(
                Constants.MSG_TYPES.START_GAME,
                this.createStartMessage(this.id, p, goal, opponents)
            );
        }); 
    }

    update(){
        // If needed, calculated time elapsed
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        
        // part that sends game update to players, supposedly
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            const p = this.players[playerID];
            const opponents = []
           
            Object.keys(this.sockets).forEach(opponentID =>{
                if(playerID != opponentID){
                    opponents.push(this.players[opponentID]);
                }
            });

            // sends update over the socket
            socket.emit(
                Constants.MSG_TYPES.CLIENT_UPDATE,
                this.createUpdate(opponents)
            );
        }); 
    }

    sendUpdate(playerID){
        // If needed, calculated time elapsed
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        
        // part that sends game update to players, supposedly
        const socket = this.sockets[playerID];
        const p = this.players[playerID];
        const opponents = []
        
        Object.keys(this.sockets).forEach(opponentID =>{
            if(playerID != opponentID){
                opponents.push(this.players[opponentID]);
            }
        });

        // sends update over the socket
        socket.emit(
            Constants.MSG_TYPES.CLIENT_UPDATE,
            this.createUpdate(opponents),
        );
    }

    createStartMessage(gameID, player, goal, opponents){
        var serializedOpponents = [];
        opponents.forEach(opp => {
            serializedOpponents.push(opp.serialize());
        });
        
        return{
            t: Date.now(),
            game_id: gameID,
            me: player.serialize(),
            goal: goal,
            others: serializedOpponents,
        }
    }

    createUpdate(opponents){
        // returns array of serialized data
        var serializedOpponents = [];
        opponents.forEach(opp => {
            serializedOpponents.push(opp.serialize());
        });
        return{
            gameID: this.id,
            t: Date.now(),
            // me: player.serialize(),
            // goal: goal,
            others: serializedOpponents,

        }
    }
}

module.exports = Game;