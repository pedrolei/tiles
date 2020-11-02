import { connect, play, sendUpdate, createLobby, joinLobby } from './networking';
import { generateCode } from '../shared/utils'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Main from './render';

const Tile = require('../shared/tile');
const ClientBoard = require('./clientboard');
const GoalBoard = require('./goalboard');
const Constants = require('../shared/constants');

// import css
import './css/main.css';

// Trying out react here before everything
ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);

import './buttons';

// Canvas document constants
const canvas = document.getElementById("GameCanvas");
const ctx = canvas.getContext("2d");

// Main menu document constants
const playMenu = document.getElementById('play-menu-container');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

// Make lobby document constants
const makeLobbyButton = document.getElementById('lobby-button');
const lobbyCode = document.getElementById('lobby-code');

// Join Lobby document constants
const joinButton = document.getElementById('join-button');

// Divs canvas constants
const canvasDiv = document.getElementById('canvas-container');

function getUsername(){
    if (usernameInput.value == ""){ return "Anonymous"}
    else{ return usernameInput.value}
}

const menuMessageContainer = document.getElementById("menu-message-container");
Promise.all([
    connect(onGameOver),
]).then(() => {
    playButton.onclick = () => {
        // TODO: show searching for match message
        // hideMenus();
        menuMessageContainer.innerHTML = "Looking for a game...";
        // send username to server
        play(getUsername());    
    }
});

// Button interfaces
// ************
// Make lobby buttons
const makeLobbyContainer = document.getElementById("make-lobby-container");
const lobbyCodeContainer = document.getElementById("lobby-code-container");
makeLobbyButton.onclick = () => {
    createLobby(getUsername());
    // the rest of the stuff was moved to the networking function
}

const makeLobbyCloseButton = document.getElementById("make-lobby-close-button");
makeLobbyCloseButton.onclick = () => {
    showMainMenu();
}
// *********************

/* *********************
*  Join lobby button function 
* Need to use code to joing game
*/
const joinLobbyContainer = document.getElementById("join-lobby-container");
const joinMessageContainer = document.getElementById("join-message-container");
joinButton.onclick = () =>{
    // Menu switching
    playMenu.classList.add('none');
    joinLobbyContainer.classList.remove('none');
}

const joinLobbyStartButton = document.getElementById("join-lobby-start-button");
const lobbyInput = document.getElementById('lobby-input'); 
joinLobbyStartButton.onclick = () =>{
    // var username = usernameInput.value;
    var code = lobbyInput.value;
    console.log(`Joining lobby ${lobbyInput.value}`);
    // use lobby code to join game
    if (code.length == Constants.UTILS.CODE_LENGTH){
        // need return code from lobby in case server can't find a game
        // with the code
        // Use anonymous username for now
        joinLobby(getUsername(), code);
    }else{
        joinMessageContainer.innerHTML = "Invalid code";
        console.log("Code not the right length.");
    }  
    
}

const joinLobbyCloseButton = document.getElementById("join-lobby-close-button");
joinLobbyCloseButton.onclick = () =>{
    showMainMenu();
}
// *************

var colors = ["red", "yellow", "blue", "white", "orange", "green"];

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
// to detect leading edge of input
var lastPressed = false;

var boards = [];
// var client = new Client();

var gameInterval;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    lastPressed = false;
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
}

function handleInputs(player){
    var c = 0;
    var r = 0;
    if(!lastPressed){
        if(rightPressed){
            // console.log("Right");
            c++;
            player.moveBlack(c, r);
            lastPressed = true; 
        }
        else if(leftPressed){
            // console.log("Left");
            c--;
            player.moveBlack(c, r);
            lastPressed = true;
        }
        else if(upPressed){
            // console.log("Up");
            r--;
            player.moveBlack(c, r);
            lastPressed = true;
        }
        else if(downPressed){
            // console.log("Down");
            r++;
            player.moveBlack(c, r);
            lastPressed = true;
        }
    }
    
}

function loop(gameID, playerID, boards, goalBoard){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleInputs(boards[0]);
    for(var i=0; i < boards.length; i++){
        boards[i].draw(ctx);
    }
    goalBoard.draw(ctx);
    
    sendUpdate(gameID, playerID, boards[0]);

    for(var i=0; i < boards.length; i++){
        if(hasWon(boards[i], goalBoard, goalBoard.boardSize)){
            // draw win message on the canvas
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            var x_pos = canvas.width/2 - ((Constants.GAME.TILE_PADDING+Constants.GAME.TILE_WIDTH)) - (60/2);
            var y_pos = 300;
            if (i == 0){
                ctx.fillText(`You won!`, x_pos, y_pos);
            }
            else{
                ctx.fillText(`You lost :(`, x_pos, y_pos);
            }
            onGameOver();
            return;
        }
    }

}

function hasWon(board, goalBoard, goalSize){
    //check the center three
    // in case you want to change where to check for the goal
    // you can adjust these variables 
    var startX = 1;
    var startY = 1;
    var endX = goalSize;
    var endY = goalSize;

    for(var i=startX, x = 0; i <= endX; i++, x++){
        for(var j=startY, y = 0; j <= endY; j++, y++){
            if(board.tiles[i][j].color != goalBoard.tiles[x][y].color){
                return false;
            }
        }
    }
    
    return true;
}


export function startGame(update){
    // need to get the boards from the server
    console.log("Recieved Start Message:");
    
    // play button functionality
    // remove menus and only show canvas
    hideMenus();
    showCanvas();
    
    var gameID = update.game_id;
    var playerID = update.me.id;
    
    var player1Board = update.me.tiles;
    var player2Board = update.others[0].tiles;
    var goalBoard = update.goal;
    
    var player1 = new ClientBoard(update.me.username, 25, 25, 4, player1Board);
    var player2 = new ClientBoard(update.others[0].username, canvas.width-((Constants.GAME.TILE_PADDING+Constants.GAME.TILE_WIDTH)*5) - 25, 25, 4, player2Board);
    
    // reset boards in case there was a last game
    boards = []
    // make a board of size three 
    var goal = new GoalBoard(canvas.width/2 - ((Constants.GAME.TILE_PADDING+Constants.GAME.TILE_WIDTH)) - (60/2), 25, 4, goalBoard);
    boards.push(player1);
    boards.push(player2);
    gameInterval = setInterval(loop, 1000/60, gameID, playerID, boards, goal);
    
}

function onGameOver(){
    // stuff to do on game over, mostly stop redering things and stuff
    // for now, present the game menu again
    playMenu.classList.remove('none');
    clearInterval(gameInterval);
}

export function recieveLobbyCode(code){
    console.log(`Recieved Lobby Code: ${code}`);
    // change code inside 
    lobbyCodeContainer.innerHTML = code;
    playMenu.classList.add('none');
    makeLobbyContainer.classList.remove('none');
}

export function updateBoards(update){
    boards[1].updateTiles(update.others[0].tiles);
}


// figure out how to move this stuff to a different file later
const instructionsContainer = document.getElementById("instructions-container");
function hideMenus(){
    playMenu.classList.add('none');
    makeLobbyContainer.classList.add('none');
    joinLobbyContainer.classList.add('none');
    instructionsContainer.classList.add('none');

}

function showCanvas(){
    canvasDiv.classList.remove('none');
}

function hideCanvas(){
    canvasDiv.classList.add('none');
}

function showMainMenu(){
    playMenu.classList.remove('none');
    makeLobbyContainer.classList.add('none');
    joinLobbyContainer.classList.add('none');
}