import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { sequelize } from "./database/models/";
import passport from "passport";
import session from 'express-session';
import {ensureAuth,ensureGuest} from './google/middlewares'
import './google/auth';
import { authenticate, localSignupStrategy } from "./auth/localAuth";
import localAuthRouter from "./routes/localAuthRoute";
import updateRoute from "./routes/updateProfile";
import models from './database/models/index';

dotenv.config();

const app = express();
app.use(session({secret:'dats',resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session({secret:'dats',resave: true, saveUninitialized: true}));


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
app.use("/api/profile",authenticate, updateRoute)
app.use("/api/users", async(req, res)=>{
    try{
        const users = await models.User.findAll()
        return res.send(users);
    }
    catch(err){console.log(err)}
})

app.get('/auth/failure',(req,res)=>res.send('Something went wrong...'))
app.get('/auth/google',
    passport.authenticate('google',{scope:['email','profile']})
)
app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect:'/protected',
        failureRedirect: '/auth/failure'
    })
)
app.get('/sample-ui',(req,res)=>{
    res.send(`<a href="/auth/google">Authenticate with google </a>`);
})
app.get('/protected',ensureAuth,async(req,res)=>{
    res.send(`Hello !,${JSON.stringify(req.user)}`);
})
app.get('/logout',(req,res)=>{
    req.logout();
    req.session.destroy();
    res.send('GoodBye')
})
export default app;
