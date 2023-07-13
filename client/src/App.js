import react, { useState, useEffect, useRef } from "react";

import "./styles/App.css";

import ACRES from "./modules/acres.js";
import SEEDS from "./modules/seeds.js";
import INVENTORY from "./modules/inventory.js";
import CROP_TEMPLATE from "./modules/cropTemplate.js";
import IMG_MAP from "./modules/imgMap.js";

import PlantMenu from "./components/PlantMenu";
import LevelDisplay from "./components/LevelDisplay";
import CropProgressBar from "./components/CropProgressBar";
import InventoryPanel from "./components/InventoryPanel";
import OrdersPanel from "./components/OrdersPanel";
import Leaderboard from "./components/Leaderboard";
import LevelUpPanel from "./components/LevelUpPanel";
import MarketplacePanel from "./components/MarketplacePanel";

import WellIcon from "./images/well.png";
import BarnIcon from "./images/barn.png";
import BoardIcon from "./images/orders-board.png";
import CoinIcon from "./images/coin.png";
import EarthIcon from "./images/earth.png";
import MarketplaceIcon from "./images/marketplace.png";

import GrowingCropsIcon from "./images/growing-crops.png";


function App() {

  // USE STATE W/ LOCAL STORAGE
  function useStickyState(defaultValue, key) {
    const [value, setValue] = useState(() => {
      const stickyValue = localStorage.getItem(key);
      return stickyValue !== null
        ? JSON.parse(stickyValue)
        : defaultValue;
    });
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
  }

  const [sales, setSales] = useState([]);

  // COMPLEX USER DATA
  const [inventory, setInventory] = useStickyState(INVENTORY, "inventory");
  const [land, setLand] = useStickyState(ACRES, "land");
  const [crops, setCrops] = useStickyState([], "crops");

  const [orders, setOrders] = useStickyState([], "orders");

  // SIMPLE USER DATA
  const [farmId, setFarmId] = useState(null);
  const [farmName, setFarmName] = useState("My farm");
  const [userLevel, setUserLevel] = useState(1);
  const [userLevelProgress, setUserLevelProgress] = useState(0);
  const [userCoins, setUserCoins] = useState(25);

  const getSyncedUserCoins = async () => {
    let res = await fetch("http://localhost:3001/farms", {
      method: "GET",
      mode: "cors",
      headers: { 
        'Content-Type': 'application/json'
      },
    })

    let data = await res.json();

    if (data.filter(val => val.farmId === farmId).length > 0) {
      return data.filter(val => val.farmId === farmId)[0].coins;
    }
  }

  const setSyncedUserCoins = async () => {
    let coins = await getSyncedUserCoins();
    setUserCoins(coins);
  }


  const [unlockedSeeds, setUnlockedSeeds] = useStickyState([], "unlockedSeeds");

  const [waterSelected, setWaterSelected] = useState(false);
  const [renamingFarm, setRenamingFarm] = useState(false);

  const [selectedAcre, setSelectedAcre] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const [showPlantMenu, setShowPlantMenu] = useState(null);
  const [showCropProgressBar, setShowCropProgressBar] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLevelUpPanel, setShowLevelUpPanel] = useState(false);
  const [showMarketplacePanel, setShowMarketplacePanel] = useState(false);

  const [mouseTarget, setMouseTarget] = useState(null);

  const [scrollPos, setScrollPos] = useState(0);
  const scrollRef = useRef(null);

  const [time, setTime] = useStickyState(0, "time");


  // ----------------------- CONFIGS -----------------------

  const buyerNames = ["Farmer Joe", "Farmer Jenny"];
  const plantGrowOdds = 0.75; // likelihood of plant growing every second
  const xpRate = 5;
  const plantGrowRate = 1;
  const gainSeedsOdds = 0.5; // likelihood of crop harvesting resulting in 2 seeds
  const ordersUnlockLvl = 2;
  const marketplaceUnlockLvl = 7;
  const waterLikelihood = 0.25; // likelihood of land needing to be watered after harvest
  const ordersXpRate = 2;
  const maxLevel = 50;
  const minItemQuantity = Math.floor(userLevel*0.5+2); // min num of certain item in order
  const maxItemQuantity = Math.floor(userLevel*0.9+4); // max num of certain item in order
  const maxSaleQuantity = 15;


  // -------------------------------------------------------


  // GET ID FROM LOCAL STORAGE, SET DATA FROM DB
  useEffect(() => {
    let id = localStorage.getItem("farmId");
    if (id != "" && id != null) {
      setFarmId(parseInt(id));
      fetch("http://localhost:3001/farms", {
        method: "GET",
        mode: "cors",
        headers: { 
          'Content-Type': 'application/json'
        },
      })
        .then(res => res.json())
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].farmId === parseInt(id)) {
              setFarmName(data[i].farmName);
              setUserLevel(data[i].level);
              setUserLevelProgress(data[i].levelProgress);
              setUserCoins(data[i].coins);
            }
          }
      })
    }
  }, []);

  // SET ID IN LOCAL STORAGE ON CHANGE
  useEffect(() => {
    if (farmId) {
      localStorage.setItem("farmId", farmId.toString());
    }
  }, [farmId])

  // SET COMPLEX USER DATA, UNLOCKED SEEDS IN LOCAL STORAGE ON CHANGE
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("land", JSON.stringify(land));
    localStorage.setItem("crops", JSON.stringify(crops));
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("unlockedSeeds", JSON.stringify(unlockedSeeds));
  }, [inventory, land, crops, orders, unlockedSeeds])

  // GET COMPLEX USER DATA, UNLOCKED SEEDS FROM LOCAL STORAGE
  useEffect(() => {
    let inv = localStorage.getItem("inventory");
    if (inv && JSON.parse(inv).length > 0) { setInventory(JSON.parse(inv)) };

    let lan = localStorage.getItem("land");
    if (lan && lan !== "") { setLand(JSON.parse(lan)) };

    let cro = localStorage.getItem("crops");
    if (cro && JSON.parse(cro).length > 0) { setCrops(JSON.parse(cro)) };
    
    let ord = localStorage.getItem("orders");
    if (ord && JSON.parse(ord).length > 0) { setOrders(JSON.parse(ord)) };

    let unl = localStorage.getItem("unlockedSeeds");
    if (unl && JSON.parse(unl).length > 0) { setUnlockedSeeds(JSON.parse(unl)) };
  }, [])

  // GET & SET TIME LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("time", JSON.stringify(time));
  }, [time])

  useEffect(() => {
    let time = localStorage.getItem("time");
    if (time) { setTime(JSON.parse(time)) };
  }, [])

  // ADD NEW FARM TO DB
  useEffect(() => {

    let farmId = localStorage.getItem("farmId");
    if (farmId === null || farmId === "") {
      fetch("http://localhost:3001/farms", {
        method: "GET",
        mode: "cors",
        headers: { 
          'Content-Type': 'application/json'
        },
      })
        .then(res => res.json())
        .then(data => {
          let farmsCount = data.length;
          setFarmId(farmsCount);
          fetch("http://localhost:3001/new-farm", {
            method: "POST",
            mode: "cors",
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                farmId: farmsCount,
                farmName: farmName,
                level: userLevel,
                levelProgress: userLevelProgress,
                coins: userCoins
            })
          })
        })
    }
  }, [])

  // UPDATE FARM IN DB ON DATA CHANGED
  useEffect(() => {
    fetch("http://localhost:3001/update-farm", {
      method: "PUT",
      mode: "cors",
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          farmId,
          farmName,
          levelProgress: userLevelProgress,
          level: userLevel,
          coins: userCoins
      })
    })
  }, [farmName, userLevel, userLevelProgress, userCoins])

  // UPDATE TIME EVERY SECOND
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(prev => prev + 1);
    }, 1000);
  
    return () => clearTimeout(timer);
  });

  // GROW CROPS IN SYNC WITH TIME
  useEffect(() => {
    let updatedCrops = [...crops];
    for (let i = 0; i < updatedCrops.length; i++) {
      let chance = Math.random();
      if (chance <= plantGrowOdds) {
        updatedCrops[i].timeLeft = Math.max(updatedCrops[i].timeLeft - plantGrowRate, 0);
      }
    }

    setCrops(updatedCrops);
  }, [time])

  // UPDATE GROWING CROP IMAGES
  useEffect(() => {
    for (let i = 0; i < crops.length; i++) {
      let cropAcre = crops[i].acre;
      let cropPlot = crops[i].plot;

      let growImg = document.getElementById(`growing-crops-img-${cropAcre}-${cropPlot}`);
      let finishedImg = document.getElementById(`finished-crop-img-${cropAcre}-${cropPlot}`);

      if (crops[i].timeLeft > 0) {
        growImg.style.display = "block";
        finishedImg.style.display = "none";
      } else {
        finishedImg.style.display = "block";
        growImg.style.display = "none";
        finishedImg.src = IMG_MAP[crops[i].crop];
        if (showCropProgressBar === land[cropAcre].plots[cropPlot]) {
          setShowCropProgressBar(null);
        }
      }
    }
  }, [crops])

  // CROP SELECTION
  useEffect(() => {
    if (selectedPlot !== null && selectedAcre !== null) {
      let acrePlot = land[selectedAcre].plots[selectedPlot];
      let crop = crops.find(val => (val.acre === selectedAcre && val.plot === selectedPlot));

      if (acrePlot.inUse) {
        if (crop.timeLeft > 0) {
          setShowCropProgressBar(acrePlot);
          setShowPlantMenu(null);
        }
      } else {
        setShowCropProgressBar(null);
        if (acrePlot.watered) {
          setShowPlantMenu(acrePlot);
        }
      }
    } else {
      setShowCropProgressBar(null);
      setShowPlantMenu(null);
    }
  }, [selectedPlot, selectedAcre]);

  // LEVEL UP
  useEffect(() => {
    if (userLevelProgress >= 1) {
      if (userLevel < maxLevel) {
        let lvls = Math.floor(userLevelProgress);
        let remainder = userLevelProgress - lvls;
        let newLvl = userLevel + lvls;
        setUserLevelProgress(remainder);
        setUserLevel(prev => prev + lvls);

        if (newLvl !== 1) {
          setShowLevelUpPanel(true);
        }
        
        if ((newLvl === 2) || ((newLvl - 2) % 3 === 0)) {
          let newOrders = [...orders, getNewOrder()];
          setOrders(newOrders);
        }
      } else {
        setUserLevelProgress(1);
      }
    }
  }, [userLevelProgress])

  // GIVE USER 3 SEEDS WHEN SEED UNLOCKED
  useEffect(() => {
    for (let i = 0; i < Object.keys(SEEDS).length; i++) {
      let crop = Object.keys(SEEDS)[i];
      if (userLevel === SEEDS[crop].lvl && unlockedSeeds.indexOf(crop) === -1) {
        let newUnlockedSeeds = [...unlockedSeeds];
        newUnlockedSeeds.push(crop);
        setUnlockedSeeds(newUnlockedSeeds);

        let newInv = {...inventory};
        newInv[`${crop}-seed`] = 3;
        setInventory(newInv);
      }
    }
  }, [userLevel])

  // RESET FARM WHEN FARM ID CHANGED
  useEffect(() => {
    if (!localStorage.getItem("farmId")) {
      setInventory(INVENTORY);
      setLand(ACRES);
      setCrops([]);
      setOrders([]);
      setTime(0);
      setUnlockedSeeds([]);
    }
  }, [localStorage.getItem("farmId")])

  const purchaseAcre = (acreVal) => {
    console.log("!");

    let acre = land[acreVal];
    setUserCoins((prev) => {
      return prev - acre.price;
    })
    acre.owned = true;
  }

  const harvestFunction = (crop, plotIndx, acreIndx) => {

    setSelectedAcre(null);
    setSelectedPlot(null);
    setShowCropProgressBar(null);
    setShowPlantMenu(null);

    let cropLvl = SEEDS[crop.crop].lvl;

    let cropImg = document.getElementById(`finished-crop-img-${acreIndx}-${plotIndx}`);
    cropImg.style.display = "none";

    let newInventory = {...inventory};
    newInventory[crop.crop] += 1;
    let chance = Math.random();
    if (chance <= gainSeedsOdds) {
      newInventory[`${crop.crop}-seed`] += 2;
    } else {
      newInventory[`${crop.crop}-seed`] += 1;
    }
    setInventory(newInventory);

    chance = Math.random() > waterLikelihood;

    let newLand = {...land};
    newLand[acreIndx].plots[plotIndx].inUse = false;
    newLand[acreIndx].plots[plotIndx].watered = chance;
    setLand(newLand);

    let newCrops = crops.filter(crop => (crop.acre !== acreIndx || crop.plot !== plotIndx));
    setCrops(newCrops);

    let xp = ((cropLvl + 1) * xpRate) / (userLevel*100);
    setUserLevelProgress(prev => prev + xp);
  }

  const getNewOrder = () => {
    let newOrder = {
      "index": 0,
      "items": {},
      "price": 0,
      "xp": 0,
      "buyer": ""
    };

    let highestIndex = 0;
    for (let i = 0; i < Object.keys(orders).length; i++) {
      highestIndex = Math.max(orders[Object.keys(orders)[i]].index, highestIndex);
    }

    newOrder.index = highestIndex + 1;
    let unlockedItems = Object.keys(SEEDS).filter(crop => SEEDS[crop].lvl <= userLevel);
    let chance = Math.ceil(Math.random() * 2) + 1;

    let len = unlockedItems.length;

    let orderPrice = 0;
    let orderXP = 0;

    // set items
    for (let i = 0; i < Math.min(chance, len); i++) {
      let chosenItemIndex = Math.floor(Math.random() * unlockedItems.length);
      let chosenItem = unlockedItems[chosenItemIndex];
      unlockedItems.splice(chosenItemIndex, 1);


      let chosenQuantity = Math.floor(minItemQuantity + (Math.random() * (maxItemQuantity - minItemQuantity)));
      newOrder.items[chosenItem] = chosenQuantity;

      let quantityPrice = SEEDS[chosenItem].sellPrice * chosenQuantity;
      orderPrice += quantityPrice;
      orderXP += Math.ceil(quantityPrice / 5);
    }

    newOrder.price = orderPrice;
    newOrder.xp = orderXP;
    newOrder.buyer = buyerNames[Math.floor(Math.random() * buyerNames.length)];

    return newOrder;
  }

  return (
    <div id="app" className={waterSelected ? "waterSelected" : ""}>
      <LevelDisplay
        farmId={farmId}
        farmName={farmName}
        setFarmName={setFarmName}
        userLevel={userLevel}
        userLevelProgress={userLevelProgress}
        renamingFarm={renamingFarm}
        setRenamingFarm={setRenamingFarm}
      />

      <div id="buttons-panel">
        <div id="coins-display">
          <img src={CoinIcon} />
          <h3>{userCoins}</h3>
        </div>
        <div id="leaderboard-btn" onClick={() => setShowLeaderboard(prev => !prev)}>
          <img src={EarthIcon} />
        </div>
      </div>

      <div id="farm-land">
        {Object.keys(land).map((acreVal, acreIndx) => {
          return <div className={`acre ${!land[acreVal].owned ? (userLevel >= land[acreVal].minLvl) ? 'available-acre' : '' : ''}`} id={`acre-${acreVal}`} key={`acre-${acreIndx}`} style={
            land[acreVal].owned ? {backgroundColor: "#886e52"} : {backgroundColor: "rgba(0, 0, 0, 0"}
          } onClick={() => {
            if (!land[acreVal].owned && land[acreVal].price <= userCoins && land[acreVal].minLvl <= userLevel) { purchaseAcre(acreVal) };
          }}>
            {land[acreVal].owned ? <>
              {Array.from(Array(9), (plotVal, plotIndx) => {
                return <div className={`plot plot-${plotIndx}`} key={`plot-${plotIndx}`} style={
                  land[acreVal].plots[plotIndx].watered ? {backgroundColor: "#634b39"} : {backgroundColor: "#886e52"}
                } onClick={(e) => {

                  let crop = crops.find(val => (val.acre === acreIndx && val.plot === plotIndx));

                  if (crop && crop.timeLeft === 0) {
                    harvestFunction(crop, plotIndx, acreIndx);
                  } else {
                    if (waterSelected) {
                      land[acreVal].plots[plotIndx].watered = true;
                    } else {
                      if (selectedPlot === plotIndx && selectedAcre === acreIndx) {
                        setSelectedPlot(null);
                        setSelectedAcre(null);
                        setShowCropProgressBar(null);
                        setShowPlantMenu(null);
                      } else {
                        setSelectedPlot(plotIndx);
                        setSelectedAcre(acreIndx);
                        setMouseTarget(e.target);
                      }
                    }
                  }

                }}>
                  <img className="growing-crops-img" id={`growing-crops-img-${acreIndx}-${plotIndx}`} src={GrowingCropsIcon}/>
                  <img className="finished-crop-img" id={`finished-crop-img-${acreIndx}-${plotIndx}`}  src={""}/>

                  {showCropProgressBar && selectedAcre === acreIndx && selectedPlot === plotIndx && crops.find(val => (val.acre === selectedAcre && val.plot === selectedPlot)) && <CropProgressBar 
                    selectedAcre={selectedAcre}
                    selectedPlot={selectedPlot}
                    crops={crops}
                    SEEDS={SEEDS}
                    mouseTarget={mouseTarget}
                  />}

                  {showPlantMenu && selectedAcre === acreIndx && selectedPlot === plotIndx && <PlantMenu 
                    SEEDS={SEEDS}
                    inventory={inventory}
                    setInventory={setInventory}
                    land={land}
                    setLand={setLand}
                    userLevel={userLevel}
                    mouseTarget={mouseTarget}
                    selectedPlot={selectedPlot}
                    setSelectedPlot={setSelectedPlot}
                    selectedAcre={selectedAcre}
                    setSelectedAcre={setSelectedAcre}
                    setCrops={setCrops}
                    CROP_TEMPLATE={CROP_TEMPLATE}
                    scrollPos={scrollPos}
                    setScrollPos={setScrollPos}
                    scrollRef={scrollRef}
                  />}
                </div>
              })}
            </> : ((userLevel >= 0) && <h1 className="acre-price-label">{land[acreVal].price}</h1>)}
          </div>
        })}
      </div>

      <div id="buildings-div">

        <div id="barn">
          <img src={BarnIcon} onClick={() => {setShowInventory(prev => !prev)}}/>
        </div>

        <div id="well">
          <img src={WellIcon} onClick={() => {setWaterSelected(prev => !prev)}}/>
        </div>

        {userLevel >= ordersUnlockLvl && (<div id="orders-board">
          <img src={BoardIcon} onClick={() => {setShowOrders(prev => !prev)}}/>
        </div>)}

        {userLevel >= marketplaceUnlockLvl && (<div id="marketplace">
          <img src={MarketplaceIcon} onClick={() => {setShowMarketplacePanel(prev => !prev)}}/>
        </div>)}

      </div>


      {showInventory && <InventoryPanel 
        items={inventory}
        IMG_MAP={IMG_MAP}
        setShowInventory={setShowInventory}
      />}

      {showOrders && <OrdersPanel
        orders={orders}
        setOrders={setOrders}
        setShowOrders={setShowOrders}
        inventory={inventory}
        setInventory={setInventory}
        setUserCoins={setUserCoins}
        userLevel={userLevel}
        setUserLevelProgress={setUserLevelProgress}
        xpRate={xpRate}
        getNewOrder={getNewOrder}
        ordersXpRate={ordersXpRate}
      />}

      {showLeaderboard && <Leaderboard
        setShowLeaderboard={setShowLeaderboard}
      />}

      {showLevelUpPanel && <LevelUpPanel
        setShowLevelUpPanel={setShowLevelUpPanel}
        userLevel={userLevel}
      />}

      {showMarketplacePanel && <MarketplacePanel
        farmId={farmId}
        farmName={farmName} 
        userLevel={userLevel}
        userCoins={userCoins}
        setUserCoins={setUserCoins}
        getSyncedUserCoins={getSyncedUserCoins}
        setSyncedUserCoins={setSyncedUserCoins}
        setShowMarketplacePanel={setShowMarketplacePanel}
        inventory={inventory}
        setInventory={setInventory}
        maxSaleQuantity={maxSaleQuantity}
        sales={sales}
        setSales={setSales}
      />}


    </div>
  );
}

export default App;
