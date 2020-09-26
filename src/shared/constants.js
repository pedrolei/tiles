module.exports = Object.freeze({
    MSG_TYPES: {
        START_GAME: 'start_game',
        JOIN_GAME: 'join_game',
        CREATE_LOBBY: 'create_lobby',
        LOBBY_CODE: 'lobby_code',
        JOIN_LOBBY: 'join_lobby',
        CLIENT_UPDATE: 'client_update',
        SERVER_UPDATE: 'server_update',
        GAME_OVER: 'dead',
    },
    GAME:{
        TILE_HEIGHT: 75,
        TILE_WIDTH: 75,
        TILE_PADDING: 3,
    },
    UTILS:{
        CODE_LENGTH: 5,
    },
});