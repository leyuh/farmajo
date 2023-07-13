import "../styles/InventoryPanel.css";

const InventoryPanel = (props) => {
    const { 
        items, 
        IMG_MAP,
        setShowInventory 
    } = props;

    return <div id="inventory-panel">
        <div className="board-title">
            <h1>INVENTORY</h1>
        </div>

        <button className="close-btn" onClick={() => setShowInventory(false)}>X</button>

        <div id="inv-grid">
            {Object.keys(items).filter((itemName, i) => items[itemName] > 0).map((itemName, i) => {
                return <div className="inv-item-div" key={i}>
                    <h1 className="inv-crate-detail">X</h1>

                    <div className="inv-crate-sign">
                        <img className="inv-item-img" src={IMG_MAP[itemName]} />
                        <h3 className="inv-item-name">{itemName}</h3>
                        <h1 className="inv-item-quantity">{items[itemName]}</h1>
                    </div>

                </div>
            })}
        </div>
    </div>
}

export default InventoryPanel;