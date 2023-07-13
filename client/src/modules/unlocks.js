import OrdersIcon from "../images/orders-board.png";

import MintIcon from "../images/crops/mint.png";
import CarrotIcon from "../images/crops/carrots.png";
import LettuceIcon from "../images/crops/lettuce.png";
import StrawberryIcon from "../images/crops/strawberry.png";

import OrderIcon from "../images/order.png";
import MarketplaceIcon from "../images/marketplace.png";
import LandIcon from "../images/land.png";

var LEVEL_UNLOCKS = {
    "2": {
        "Orders": OrdersIcon,
    },
    "3": {
        "Mint": MintIcon,
    },
    "4": {

    },
    "5": {

    },
    "6": {
        "Carrots": CarrotIcon,
    },
    "7": {
        "Marketplace": MarketplaceIcon,
    },
    "8": {
        
    },
    "9": {
        "Lettuce": LettuceIcon,
    },
    "10": {
        "Composter": "",
    },
    "11": {

    },
    "12": {

    },
    "13": {
        "Strawberries": StrawberryIcon,
    },
    "14": {

    },
    "15": {
        "Pond": "",
    },
    "16": {

    },
    "17": {

    },
    "18": {
        "Potato": "",
    },
    "19": {

    },
    "20": {

    },
    "21": {

    },
    "22": {

    },
    "23": {

    },
    "24": {
        "Pumpkin": "",
    },
    "25": {

    },
    "26": {

    },
    "27": {

    },
    "28": {

    },
    "29": {

    },
    "30": {
        "Apple": "",
    },
    "45": {
        "Golden Apple": "",
    }
}

// orders
LEVEL_UNLOCKS["2"]["+1 Order"] = OrderIcon;
for (let i = 5; i <= 50; i+=3) {
    if (LEVEL_UNLOCKS[i.toString()]) {
        LEVEL_UNLOCKS[i.toString()]["+1 Order"] = OrderIcon;
    } else {
        LEVEL_UNLOCKS[i.toString()] = {};
        LEVEL_UNLOCKS[i.toString()]["+1 Order"] = OrderIcon;
    }
}
// acres every other lvl
for (let i = 3; i <= 31; i+=2) {
    if (LEVEL_UNLOCKS[i.toString()]) {
        LEVEL_UNLOCKS[i.toString()]["+1 Acre"] = LandIcon;
    } else {
        LEVEL_UNLOCKS[i.toString()] = {};
        LEVEL_UNLOCKS[i.toString()]["+1 Acre"] = LandIcon;
    }
}

export default LEVEL_UNLOCKS;