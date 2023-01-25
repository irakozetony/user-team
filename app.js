import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { sequelize } from "./database/models/";
import passport from "passport";
import { localSignupStrategy } from "./auth/localAuth";
import localAuthRouter from "./routes/localAuthRoute";
import models from './database/models/index';

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


app.use("/api/localauth", localAuthRouter);
app.use("/api/users", async(req, res)=>{
    try{
        const users = await models.User.findAll()
        return res.send(users);
    }
    catch(err){console.log(err)}
})


export default app;
