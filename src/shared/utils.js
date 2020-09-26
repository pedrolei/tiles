const Constants = require('../shared/constants');

function shuffle(array) {
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

function generateCode(){
    const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var code = '';
    for(var i = 0; i < Constants.UTILS.CODE_LENGTH; i++){
        var rand = Math.floor(Math.random() * chars.length);
        code += chars.substring(rand, rand+1);
    }

    return code;
}

module.exports = { shuffle, generateCode };