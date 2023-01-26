import express  from "express";
import passport from "passport";
import session from 'express-session';
import {ensureAuth,ensureGuest} from './middlewares'
import './auth';

const app = express();
app.use(session({secret:'dats',resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session({secret:'dats',resave: true, saveUninitialized: true}));

app.get('/',ensureGuest,(req,res)=>{
    res.send(`<a href="/auth/google">Authenticate with google </a>`);
})

app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect:'/protected',
        failureRedirect: '/auth/failure'
    })
)

app.get('/auth/failure',(req,res)=>res.send('Something went wrong...'))
app.get('/auth/google',
    passport.authenticate('google',{scope:['email','profile']})
)


app.get('/protected',ensureAuth,(req,res)=>{
    console.log("user:",req.user)
    res.send(`Hello !,${JSON.stringify(req.user)}`);
})

app.get('/logout',(req,res)=>{
    req.logout();
    req.session.destroy();
    res.send('GoodBye')
})

app.listen(5000, ()=> console.log('listenig on:5000'))