import { useState, useEffect, useRef } from "react";
import "../styles/MarketplacePanel.css";

import IMG_MAP from "../modules/imgMap.js";
import SEEDS from "../modules/seeds.js";

const MarketplacePanel = (props) => {

    const {
        farmId,
        farmName,
        userLevel,
        userCoins,
        setUserCoins,
        getSyncedUserCoins,
        setSyncedUserCoins,
        setShowMarketplacePanel,
        inventory,
        setInventory,
        maxSaleQuantity,
        sales,
        setSales
    } = props;

    const quantityRef = useRef(null);
    const priceRef = useRef(null);

    const [unlockedSales, setUnlockedSales] = useState([]);
    const [showNewSalePanel, setShowNewSalePanel] = useState(false);
    const [showSalePanel, setShowSalePanel] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const [selectedNewSaleProduct, setSelectedNewSaleProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);

    const getItemPrice = (item, quantity) => {
        let unitPrice;

        if (item.indexOf("-seed") !== -1) {
            // seed
            let cropName = item.slice(0, -5);
            unitPrice = SEEDS[cropName].seedPrice;
        } else {
            // crop
            unitPrice = SEEDS[item].sellPrice;
        }

        return unitPrice * quantity;
    }

    const postFunction = () => {
        if (selectedNewSaleProduct && quantity && price) {
            setShowNewSalePanel(false);

            let newInventory = {...inventory};
            newInventory[selectedNewSaleProduct] -= quantity;
            setInventory(newInventory);

            let maxIndex = 0;
            for (let i = 0; i < sales.length; i++) {
                if (sales[i].saleIndex >= maxIndex) {
                    maxIndex = sales[i].saleIndex;
                }
            }

            fetch("http://localhost:3001/new-sale", {
                method: "POST",
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    saleIndex: maxIndex + 1,
                    sellerFarmId: farmId,
                    sellerFarmName: farmName,
                    product: selectedNewSaleProduct,
                    productQuantity: quantity,
                    price: price
                })
            })
                .then(res => res.json())
                .then(data => {
                    setSelectedNewSaleProduct(null);
                    setQuantity(1);
                    setPrice(1);
                    setSales(data);

                })
        }
    }

    const purchaseFunction = (sale) => {

        let isOwnSale = sale.sellerFarmId === farmId;
        let isNpcSale = sale.sellerFarmId === 1 || sale.sellerFarmId === 0;

        console.log("!");

        if (!isOwnSale) {
            if (userCoins >= sale.price) {
                // buyer pays, gets items
                setUserCoins(prev => prev - sale.price);
            }
        }

        // update inv
        let newInventory = {...inventory};
        newInventory[sale.product] += sale.productQuantity;
        setInventory(newInventory);

        setShowSalePanel(false);
        setSelectedSale(null);

        if (!isOwnSale && !isNpcSale) {
            // set sale to purchased
            fetch("http://localhost:3001/purchase-sale", {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    saleIndex: sale.saleIndex,
                    sellerFarmId: sale.sellerFarmId,
                    sellerFarmName: sale.sellerfarmName,
                    product: sale.product,
                    productQuantity: sale.productQuantity,
                    price: sale.price
                })
            })
                .then(res => res.json())
                .then(data => {
                    setSales(data);
                })
        } else {
            removeSaleFunction(sale, isOwnSale);
        }
    }

    // called when seller claims their purchased sale
    const removeSaleFunction = async (sale, isOwnSale = false) => {
        if (!isOwnSale) {
            // pay user
            setUserCoins(prev => prev + sale.price);
        }

        // delete sale
        fetch("http://localhost:3001/remove-sale", {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                saleIndex: sale.saleIndex
            })
        })
            .then(res => res.json())
            .then(data => {
                setSales(data);
            })
    }
    
    const fetchSale = async (saleIndex) => {
        let data = fetch("http://localhost:3001/sales", {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => data.filter(val => val.saleIndex === saleIndex)[0])
            
        return await data;
    }

    const fetchSales = async () => {
        let data = fetch("http://localhost:3001/sales", {
            method: "GET"
        })
            .then(res => res.json())

        return await data;
    }

    // fetch sales
    useEffect(() => {
        fetchSales()
            .then(data => setSales(data))
    }, [])

    // get unlocked & unpurchased sales
    useEffect(() => {
        let passed = [];
        for (let i = 0; i < sales.length; i++) {
            let cropName;
            if (sales[i].product.indexOf("-seed") !== -1) {
                // seed
                cropName = sales[i].product.slice(0, -5);
            } else {
                // crop
                cropName = sales[i].product;
            }

            if (SEEDS[cropName].lvl <= userLevel && !sales[i].purchased) {
                passed.push(sales[i]);
            }
        }

        setUnlockedSales(passed);
    }, [sales])

    useEffect(() => {
        if (quantityRef.current && selectedNewSaleProduct) {
            quantityRef.current.innerHTML = quantity;
            setPrice(getItemPrice(selectedNewSaleProduct, quantity));
        }
    }, [quantity])

    useEffect(() => {
        if (priceRef.current) {
            priceRef.current.innerHTML = price;
        }
    }, [price])

    useEffect(() => {
        if (selectedNewSaleProduct) {
            setPrice(getItemPrice(selectedNewSaleProduct, quantity));
        }
    }, [selectedNewSaleProduct])

    useEffect(() => {
        setSelectedNewSaleProduct(null);
        setQuantity(1);
        setPrice(1);
    }, [showNewSalePanel]);

    return <div id="marketplace-panel">

        <div className="board-title">
            <h1>MARKETPLACE</h1>
        </div>
        <button className="close-btn" onClick={() => setShowMarketplacePanel(false)}>X</button>

        <h1 className="marketplace-section-title">My Sales</h1>

        <div id="my-sales-grid" className={
            (showSalePanel || showNewSalePanel) ? "mini-grid marketplace-grid" : "full-grid marketplace-grid"
        }>
            <div id="add-sale-btn" onClick={() => {
                setShowNewSalePanel(true);
                setShowSalePanel(false);
            }}>
                <h1>+</h1>
            </div>
            {sales.filter(sale => sale.sellerFarmId === farmId).sort((a, b) => {
                return (a.purchased ? -1 : 1);
            }).map((val, i) => {
                return <div className={`sale-div my-sale-div ${val.purchased ? `purchased-sale` : ``}`} key={i} onClick={async () => {
                    fetchSales()
                        .then(data => setSales(data));

                    fetchSale(val.saleIndex)
                        .then(sale => {
                            if (!sale.purchased) {
                                setSelectedSale(sale);
                                setShowSalePanel(true);
                                setShowNewSalePanel(false);
                            } else {
                                // claim sold sale
                                removeSaleFunction(sale);
                            }
                        })
                }}>
                    <img className="sale-img" src={IMG_MAP[val.product]} />
                    <h3 className="sale-quantity">{val.productQuantity}</h3>
                    <h3 className="sale-price">{val.purchased ? `Purchased!` : `${val.price} coins`}</h3>
                </div>
            })}
        </div>

        <h1 className="marketplace-section-title">Other Sales</h1>

        <div id="other-sales-grid" className={
            (showSalePanel || showNewSalePanel) ? "mini-grid marketplace-grid" : "full-grid marketplace-grid"
        }>
            {unlockedSales.filter(sale => sale.sellerFarmId !== farmId).map((val, i) => {
                return <div className="sale-div other-sale-div" key={i} onClick={() => {
                    fetchSales()
                        .then(data => setSales(data));

                    fetchSale(val.saleIndex)
                        .then(sale => {
                            if (sale) {
                                setSelectedSale(sale);
                                setShowSalePanel(true);
                                setShowNewSalePanel(false);
                            }
                        })
                }}>
                    <img className="sale-img" src={IMG_MAP[val.product]} />
                    <h3 className="sale-quantity">{val.productQuantity}</h3>
                    <h3 className="sale-price">{`${val.price} coins`}</h3>
                </div>
            })}
        </div>

        {showNewSalePanel && <div className="side-panel" id="new-sale-panel">

            <button className="close-btn" onClick={() => {
                setShowNewSalePanel(false)
                setSelectedNewSaleProduct(null);
            }}>X</button>

            <h1>New sale</h1>

            <h3>Product:</h3>
            <div id="new-sale-inv-grid">
                {Object.keys(inventory).filter((val) => inventory[val] > 0).map((val, i) =>{
                    return <div className={`new-sale-inv-item ${
                        (selectedNewSaleProduct === val) ? 'selected-new-sale-product' : ''
                    }`} key={i} onClick={() => {
                        setSelectedNewSaleProduct(val);
                        if (quantityRef.current) {
                            setQuantity(Math.min(parseInt(quantityRef.current.innerHTML), inventory[val]));
                        }
                    }}>
                        <img src={IMG_MAP[val]}/>
                        <h3>{inventory[val]}</h3>
                    </div>
                })}
            </div>

            {selectedNewSaleProduct && <>

                <h3 id="quantity-label">Quantity:</h3>

                <div className="new-sale-amount-div" id="new-sale-quantity-div">

                    <button onClick={() => {
                        setQuantity(1);
                    }}>&lt;&lt;</button>

                    <button onClick={() => {
                        setQuantity(Math.max(quantity - 1, 1))
                    }}>&lt;</button>

                    <h3 ref={quantityRef}>1</h3>

                    <button onClick={() => {
                        setQuantity(Math.min(quantity + 1, maxSaleQuantity, inventory[selectedNewSaleProduct]))
                    }}>&gt;</button>

                    <button onClick={() => {
                        setQuantity(Math.min(maxSaleQuantity, inventory[selectedNewSaleProduct]));
                    }}>&gt;&gt;</button>

                </div>

                <h3 id="price-label">Price:</h3>

                <div className="new-sale-amount-div" id="new-sale-price-div">

                    <button onClick={() => {
                        setPrice(getItemPrice(selectedNewSaleProduct, quantity));
                    }}>&lt;&lt;</button>

                    <button onClick={() => {
                        setPrice(Math.max(price - 1, getItemPrice(selectedNewSaleProduct, quantity)))
                    }}>&lt;</button>

                    <h3 ref={priceRef}>{getItemPrice(selectedNewSaleProduct, 1)}</h3>

                    <button onClick={() => {
                        setPrice(Math.min(price + 1, getItemPrice(selectedNewSaleProduct, quantity) * 2))
                    }}>&gt;</button>

                    <button onClick={() => {
                        setPrice(getItemPrice(selectedNewSaleProduct, quantity) * 2);
                    }}>&gt;&gt;</button>

                </div>

                <button id="new-sale-post-btn" onClick={() => postFunction()}>POST SALE</button>

            </>}


        </div>}

        {showSalePanel && <div className="side-panel" id="sale-panel">
            <button className="close-btn" onClick={() => {
                setShowSalePanel(false);
                setSelectedSale(null);
            }}>X</button>

            <h2>{`Sale #${selectedSale.saleIndex.toString().padStart(3, "0")}`}</h2>
            <img src={IMG_MAP[selectedSale.product]} />

            <ul>
                <li>{`Seller: ${selectedSale.sellerFarmName}`}</li>
                <li>{`Seller ID: #${selectedSale.sellerFarmId.toString().padStart(4, "0")}`}</li>
                <li>{`Product: ${selectedSale.product}`}</li>
                <li>{`Quantity: ${selectedSale.productQuantity}`}</li>
                <li>{`Price: ${selectedSale.price}`}</li>
            </ul>

            <button id="buy-sale-btn" onClick={() => {
                fetchSales()
                    .then(data => setSales(data));

                fetchSale(selectedSale.saleIndex)
                    .then(sale => {
                        if (sale && !sale.purchased) {
                            purchaseFunction(selectedSale);
                        } else {
                            setShowSalePanel(false);
                            setSelectedSale(null);
                        }
                    })
            }}>BUY</button>
        </div>}
    </div>
}

export default MarketplacePanel;