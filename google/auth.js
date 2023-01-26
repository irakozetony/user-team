import passport from "passport";
import googlePassport from 'passport-google-oauth2';
import dotenv from "dotenv";
import models from "../database/models"
import jwt from "jsonwebtoken";
dotenv.config()
let GoogleStrategy = googlePassport.Strategy;

const  GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID;
const  GOOGLE_CLIENT_SECRET= process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const newUser = {
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      username: profile.emails[0].value,
      avatar: profile.photos[0].value,
      lang: profile.language,
    }
    try {
      let user = await models.User.findOne({ where: { email: newUser.email } });
      if(!user){
         user = await models.User.create({
          email: newUser.email,
          google: true,
      });
        
      }
        const token = jwt.sign(
            {email:newUser.email, id:user.id},process.env.SECRET
        );
        return done (null, {data: user,token})
    } catch (error) {
      console.error("auth.js ",error.message)
        return done(null,{data: profile});
    }
  }
));
passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user))