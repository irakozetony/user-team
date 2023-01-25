import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { sequelize } from "./database/models/";
dotenv.config();

const app = express();

export const connectDb = async ()=>{
    console.log("Checking database connection...");

    try{
        await sequelize.authenticate();
        console.log("Database connection established");
    }
    catch(err){
        console.log(`Database connection failed: ${err}`);
        process.exit(1);
    }
}

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;
