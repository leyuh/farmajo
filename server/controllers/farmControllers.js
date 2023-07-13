import FarmModel from "../models/Farms.js";

export const getFarms = async (req, res) => {
    try {
        const farms = await FarmModel.find();
        res.status(200).json(farms);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const addFarm = async (req, res) => {
    try {
        const {
            farmId,
            farmName,
            level,
            levelProgress,
            coins
        } = req.body;

        const newFarm = new FarmModel({
            farmId,
            farmName,
            levelProgress,
            level,
            coins
        })

        await newFarm.save();

        res.status(201);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const updateFarm = async (req, res) => {
    const {
        farmId,
        farmName,
        level,
        levelProgress,
        coins
    } = req.body;
    
    try {
        const farm = await FarmModel.findOneAndUpdate({"farmId": farmId}, {
            "farmName": farmName,
            "level": level,
            "levelProgress": levelProgress,
            "coins": coins
        }, {
            returnOriginal: false
        });
        res.status(201).json(farm);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
}