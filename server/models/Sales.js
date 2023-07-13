import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
    saleIndex: {
        type: Number,
        required: true
    },
    sellerFarmId: {
        type: Number,
        required: true
    },
    sellerFarmName: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    purchased: {
        type: Boolean,
        required: true
    }

})

const SaleModel = mongoose.model("sales", SaleSchema);
export default SaleModel;