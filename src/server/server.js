const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const utils = require('../shared/utils');
const webpackConfig = require('../../webpack.dev.js');

//Setup an Express server
const app = express();
app.use(express.static('public'));

if(process.env.NODE_ENV === 'development'){
    // sets up webpack for development
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
}else{
    // uses dist folder for production 
    app.use(express.static('dist'));
}

//Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
    console.log('Player connected!', socket.id);
    
    // Callback functions used to communicate with client
    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(Constants.MSG_TYPES.CREATE_LOBBY, createLobby);
    socket.on(Constants.MSG_TYPES.JOIN_LOBBY, joinLobby);
    socket.on(Constants.MSG_TYPES.SERVER_UPDATE, updateGameState);
    socket.on('disconnect', onDisconnect);
});

// Setup the game
// we'll probably need to set this up to start up a new game for every two players

var openGames = [];
var ongoingGames = new Map();

function joinGame(username){
    // console.log(this)
    if (openGames.length > 0){
        // Adding player to existing game
        var game = openGames.shift();
        console.log(`Adding player to ${game.id}`)
        game.addPlayer(this, username);
        
        ongoingGames.set(game.id, game);
        console.log("Starting game");
        ongoingGames.get(game.id).startGame();
    }
    else{
        // Opening new game
        console.log("Opening new game");
        var game = new Game(this.id);
        console.log(`Adding player to ${game.id}`)
        game.addPlayer(this, username);
        openGames.push(game);
    }
}

function createLobby(username){
    var code = utils.generateCode();
    // console.log("Opening new game");
    while(ongoingGames.get(code)){
        code = utils.generateCode();
    }
    var game = new Game(code);
    console.log(`Adding player ${username} to ${game.id}`)

    game.addPlayer(this, username);

    // add game to ongoingGames map
    ongoingGames.set(code, game);

    // send game code to the player
    this.emit(Constants.MSG_TYPES.LOBBY_CODE, code);
}

function joinLobby(update){
    var username = update.username;
    var code = update.code;

    var game = ongoingGames.get(code);
    if (!game){
        console.log("Invalid Code");
        // TODO: return invalid code to the client
    }
    else{
        game.addPlayer(this, username);
        game.startGame();
    }
}

function updateGameState(update){
    // need to get the specific game 
    var gameID = update.game_id;
    var playerID = update.player_id;
    
    // grab game with gameID
    ongoingGames.get(gameID);
    var game = ongoingGames.get(gameID);

    var tiles = update.board.tiles
    game.players[playerID].updateTiles(tiles);
    
    // maybe also send out game state to this player
    game.sendUpdate(playerID);
}

function onDisconnect(){
    // game.removePlayer(this);
}


