import mongoose from "mongoose";

const FarmSchema = new mongoose.Schema({
    farmId: {
        type: Number,
        required: true
    },
    farmName: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    levelProgress: {
        type: Number,
        required: true
    },
    coins: {
        type: Number,
        required: true
    }

})

const FarmModel = mongoose.model("farms", FarmSchema);
export default FarmModel;