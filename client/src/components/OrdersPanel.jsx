import "../styles/OrdersPanel.css";

const OrdersPanel = (props) => {

    const { 
        orders, 
        setOrders,
        setShowOrders, 
        inventory, 
        setInventory, 
        setUserCoins,
        setUserLevelProgress,
        userLevel,
        xpRate,
        getNewOrder,
        ordersXpRate
    } = props;

    const checkOrder = (orderIndex) => {
        let order = orders.filter(order => order.index === orderIndex);

        if (order) {
            order = order[0];
            for (let i = 0; i < (Object.keys(order.items)).length; i++) {
                let item = Object.keys(order.items)[i];
                let quantity = order.items[item];

                if (inventory[item] < quantity) {
                    return false;
                }
            }

            return true;
        }
    }

    const completeOrder = (orderIndex) => {
        let order = orders.filter(order => order.index === orderIndex);

        if (order) {
            order = order[0];

            // remove items from user's inventory
            let newInventory = {...inventory};
            for (let i = 0; i < (Object.keys(order.items)).length; i++) {
                let item = Object.keys(order.items)[i];
                let quantity = order.items[item];

                newInventory[item] -= quantity;
            }
            setInventory(newInventory);

            // pay user
            setUserCoins(prev => prev + order.price);

            // give user xp
            let xp = (order.xp * xpRate * ordersXpRate) / (userLevel*100);
            setUserLevelProgress(prev => prev + xp);

            // remove order from orders
            let newOrders = orders.filter(order => order.index !== orderIndex);
            newOrders.push(getNewOrder());
            setOrders(newOrders);
        }
    }


    return <div id="orders-panel">
        <div className="board-title">
            <h1>ORDERS</h1>
        </div>
        <button className="close-btn" onClick={() => setShowOrders(false)}>X</button>

        <div id="orders-grid">
            {orders.map((order, i) => {
                return <div className="order" key={i} onClick={() => {
                    if (checkOrder(order.index)) {
                        completeOrder(order.index);
                    }
                }}>
                    <ul id="items-list">
                        {Object.keys(order.items).map((orderItem, i) => {
                            return <li key={i}>{`${orderItem}:  ${order.items[orderItem]}`}</li>
                        })}
                    </ul>
                    <h3>{`Reward: ${order.price} coins`}</h3>
                    <h3>{`XP: ${order.xp}`}</h3>
                    <h3>{`Buyer: ${order.buyer}`}</h3>
                </div>
            })}
        </div>
    </div>
}

export default OrdersPanel;