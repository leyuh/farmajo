var ACRES = {};
let counter = 0;

for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
        ACRES[`${(row*4)+col}`] = {
            "price": counter*50,
            "minLvl": (counter * 2) + 1,
            "owned": (row === 0 && col === 0) ? true : false,
            "plots": [...Array.from(Array(9).keys()).map((e, i) => {
                return {
                    "inUse": false,
                    "watered": true
                }
            })]
        }
        counter++;
    }
}

export default ACRES;