import passport from "passport";
import googlePassport from 'passport-google-oauth2';
import dotenv from "dotenv";
import models from "../database/models"
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
      const user = await models.User.findOne({ where: { email: newUser.email } });
      if(user){
        done(null,{data: user,token: accessToken})
      }else{
         user = await models.User.create({
          email: req.newUser.email,
          google: true,
      });
      done (null, {data: user,token: accessToken})
        
      }
    } catch (error) {
      console.log(error.message)
    }
    return done(null,{data: profile,token: accessToken});
  }
));
passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user))