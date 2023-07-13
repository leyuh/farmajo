import SEEDS from "./seeds.js";

var INVENTORY = {};

for (const crop in SEEDS) {
    INVENTORY[`${crop}-seed`] = (crop === "wheat" ? 3 : 0);
    INVENTORY[crop] = 0;
}

export default INVENTORY;