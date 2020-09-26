import { connect, play, sendUpdate, createLobby, joinLobby } from './networking';
import { generateCode } from '../shared/utils'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Tile = require('../shared/tile');
const ClientBoard = require('./clientboard');
const GoalBoard = require('./goalboard');
const Constants = require('../shared/constants');


// import css
import './css/main.css';

// Trying out react here before everything
class PlayMenu extends React.Component {
    render() {
      return (
        <div id="play-menu">
            <input type="text" id="username-input" placeholder="Username" />
            <br/>
            <button id="play-button">Play against a random opponent</button>
            <br/>
            <button id="lobby-button">Create a lobby</button>
            <div id="lobby-code"></div>
            <br/><br/>
            <input type="text" id="lobby-input" placeholder="Put lobby code here"/>
            <button id="join-button">Join a lobby</button>
        </div>
        );
    }
}

class Canvas extends React.Component {
    render() {
      return (
        <div id="canvas-holder">
            <canvas id="GameCanvas" width="1280" height="640" className="hidden"></canvas>
        </div>
        );
    }
}

ReactDOM.render(
    <PlayMenu/>,
    // <Canvas/>,
    document.getElementById('root')
);

ReactDOM.render(
    <Canvas/>,
    document.getElementById('react-canvas')
);



// connect to the server and do things
const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const canvas = document.getElementById("GameCanvas");
const ctx = canvas.getContext("2d");

const lobbyButton = document.getElementById('lobby-button');
const lobbyCode = document.getElementById('lobby-code');

const joinButton = document.getElementById('join-button');
const lobbyInput = document.getElementById('lobby-input'); 

Promise.all([
    connect(onGameOver),
]).then(() => {
    playButton.onclick = () => {
        // TODO: show searching for match message
         
        // send username to server
        play(usernameInput.value);    
    }

});

// Button interfaces
lobbyButton.onclick = () => {
    var code = generateCode();
    // lobbyCode.innerHTML = code;
    createLobby(usernameInput.value);
}

joinButton.onclick = () =>{
    var username = usernameInput.value;
    var code = lobbyInput.value;
    console.log(`Joining lobby ${lobbyInput.value}`);
    // use lobby code to join game
    if (code.length == Constants.UTILS.CODE_LENGTH){
        joinLobby(username, code);
    }else{
        console.log("Code not the right length.");
    }
}

function onGameOver(){
    // stuff to do on game over, mostly stop redering things and stuff
}

var colors = ["red", "yellow", "blue", "white", "orange", "green"];

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
// to detect leading edge of input
var lastPressed = false;

var boards = [];
// var client = new Client();

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

    for(var i=0; i < boards.length; i++){
        if(hasWon(boards[i], goalBoard, goalBoard.boardSize)){
            // draw win message on the canvas
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(`${boards[i].username} won!`, 
                canvas.width/2 - ((Constants.GAME.TILE_PADDING+Constants.GAME.TILE_WIDTH)) - (60/2),
                300);
            console.log(`${boards[i].username} won!`);
            break;
        }
    }

    sendUpdate(gameID, playerID, boards[0]);
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
    canvas.classList.remove('hidden');
    playMenu.classList.add('none');
    
    var gameID = update.game_id;
    var playerID = update.me.id;
    
    var player1Board = update.me.tiles;
    var player2Board = update.others[0].tiles;
    var goalBoard = update.goal;
    
    var player1 = new ClientBoard(update.me.username, 25, 25, 4, player1Board);
    var player2 = new ClientBoard(update.others[0].username, canvas.width-((Constants.GAME.TILE_PADDING+Constants.GAME.TILE_WIDTH)*5) - 25, 25, 4, player2Board);
    
    // make a board of size three 
    var goal = new GoalBoard(canvas.width/2 - ((Constants.GAME.TILE_PADDING+Constants.GAME.TILE_WIDTH)) - (60/2), 25, 4, goalBoard);
    
    boards.push(player1);
    boards.push(player2);
    var interval = setInterval(loop, 1000/60, gameID, playerID, boards, goal);
    
}

export function recieveLobbyCode(code){
    console.log("Recieved Lobby Code");
    lobbyCode.innerHTML = code;
}

export function updateBoards(update){
    boards[1].updateTiles(update.others[0].tiles);
}