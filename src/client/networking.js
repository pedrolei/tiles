import io from 'socket.io-client';
import { updateBoards, startGame, recieveLobbyCode } from './index';
// import {processGameUpdate} from './state'

const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, {reconnection: false});
const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
    });
});

export const connect = onGameOver => (
    connectedPromise.then(()=>{
        // Register callbacks
        // socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
        socket.on(Constants.MSG_TYPES.START_GAME, startGame);
        socket.on(Constants.MSG_TYPES.LOBBY_CODE, recieveLobbyCode);
        socket.on(Constants.MSG_TYPES.CLIENT_UPDATE, updateBoards);
        socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    })
);

export const play = username => {
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const sendUpdate = (gameID, playerID, board) => {
    var update = {game_id: gameID, player_id:playerID, board: board};
    socket.emit(Constants.MSG_TYPES.SERVER_UPDATE, update);
};

export const createLobby = username => {
    socket.emit(Constants.MSG_TYPES.CREATE_LOBBY, username);
};

export const joinLobby = (username, code) => {
    var update = {username: username, code:code};
    socket.emit(Constants.MSG_TYPES.JOIN_LOBBY, update);
}