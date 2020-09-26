export function shuffle(array) {
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

export function generateCodes(){
    const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var coneLength = 5;
    var code = '';
    for(var i = 0; i < 5; i++){
        var rand = Math.floor(Math.random() * chars.length);
        code += chars.substring(rand, rand+1);
    }

    return code;
}