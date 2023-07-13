import { useState, useRef, useEffect } from "react";

import "../styles/PlantMenu.css";

import WheatSeedsIcon from "../images/seeds/wheat.png";
import MintSeedsIcon from "../images/seeds/mint.png";
import CarrotSeedsIcon from "../images/seeds/carrots.png";
import LettuceSeedsIcon from "../images/seeds/lettuce.png";
import StrawberrySeedsIcon from "../images/seeds/strawberry.png";

const SEED_ICONS = [
    WheatSeedsIcon, 
    MintSeedsIcon, 
    CarrotSeedsIcon, 
    LettuceSeedsIcon, 
    StrawberrySeedsIcon
];



const PlantMenu = (props) => {


    useEffect(() => {
        scrollRef.current.scrollLeft = scrollPos;
    }, [])

    let {
        SEEDS,
        inventory,
        setInventory,
        land,
        setLand,
        userLevel,
        mouseTarget,
        selectedPlot,
        setSelectedPlot,
        selectedAcre,
        setSelectedAcre,
        setCrops,
        CROP_TEMPLATE,
        scrollPos,
        setScrollPos,
        scrollRef
    } = props;

    let pos = [mouseTarget.getClientRects()[0].left, mouseTarget.getClientRects()[0].top];

    return <div id="plantMenu" ref={scrollRef} onScroll={(e) => {
        setScrollPos(e.target.scrollLeft);
    }}>
        {Object.keys(SEEDS).map((key, i) => {
            return <div 
                className={`plantMenuItem ${(SEEDS[key].lvl <= userLevel) ? "unlocked" : "locked"}`} 
                key={`plant-menu-item-${i}`} 
                style={
                    (SEEDS[key].lvl <= userLevel) ? {
                        backgroundColor: "#AA9067"
                    } : {
                        backgroundColor: "#999"
                    }
            }>
                <img src={SEED_ICONS[i]} style={
                    (SEEDS[key].lvl > userLevel) ? {
                        filter: "grayscale(100%) brightness(80%)"
                    } : {
                        filter: ""
                    }
                } onClick={() => {
                    if (SEEDS[key].lvl <= userLevel && inventory[`${key}-seed`] > 0) {
                        setSelectedPlot(null);
                        setSelectedAcre(null);

                        let newInventory = {...inventory};
                        newInventory[`${key}-seed`] -= 1;
                        setInventory(newInventory);
                        
                        let newLand = {...land};
                        newLand[selectedAcre].plots[selectedPlot].inUse = true;
                        setLand(newLand);

                        setCrops((prev) => {
                            return [{
                                "acre": selectedAcre,
                                "plot": selectedPlot,
                                "crop": key,
                                "timeLeft": SEEDS[key].growTime
                            }, ...prev];
                        })
                    }
                }}/>
                {(SEEDS[key].lvl <= userLevel) && <h5>
                    {inventory[`${key}-seed`]}
                </h5>}
            </div>
        })}
    </div>

}

export default PlantMenu;