import SaleModel from "../models/Sales.js";

export const getSales = async (req, res) => {
    try {
        const sales = await SaleModel.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const addSale = async (req, res) => {
    try {
        const {
            saleIndex,
            sellerFarmId,
            sellerFarmName,
            product,
            productQuantity,
            price
        } = req.body;

        const newSale = new SaleModel({
            saleIndex,
            sellerFarmId,
            sellerFarmName,
            product,
            productQuantity,
            price,
            purchased: false
        })

        await newSale.save();

        const sales = await SaleModel.find();
        res.status(201).json(sales);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const purchaseSale = async (req, res) => {
    try {
        const {
            saleIndex,
            sellerFarmId,
            sellerFarmName,
            product,
            productQuantity,
            price
        } = req.body;

        const sale = await SaleModel.findOneAndUpdate({"saleIndex": saleIndex}, {
            saleIndex,
            sellerFarmId,
            sellerFarmName,
            product,
            productQuantity,
            price,
            purchased: true
        }, {
            returnOriginal: false
        });
        
        const sales = await SaleModel.find();
        res.status(201).json(sales);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const removeSale = async (req, res) => {
    try {
        const {
            saleIndex
        } = req.body;

        let sale = await SaleModel.deleteOne({"saleIndex": saleIndex});
        
        const sales = await SaleModel.find();
        res.status(201).json(sales);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}