import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import FarmModel from "./models/Farms.js";
import SaleModel from "./models/Sales.js";

import { getFarms, addFarm, updateFarm } from "./controllers/farmControllers.js";
import { getSales, addSale, purchaseSale, removeSale } from "./controllers/saleControllers.js";

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/farms", getFarms);
app.post("/new-farm", addFarm);
app.put("/update-farm", updateFarm);

app.get("/sales", getSales);
app.post("/new-sale", addSale);
app.put("/purchase-sale", purchaseSale)
app.delete("/remove-sale", removeSale);

/*

fetch farms
post new farm 
update farm

fetch all sales
post sale
delete sale

*/



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => {
        console.log(`Server port: ${port}`);
    });

}).catch((err) => {
    console.log(err);
})