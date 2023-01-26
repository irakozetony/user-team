import passport from "passport";
import googlePassport from 'passport-google-oauth2';
import dotenv from "dotenv";
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
      done(null, newUser)
      // let user = await User.findOne({email:newUser.email})
      // if(user){
      //   done(null,user)
      // }else{
      //   user = await User.create(newUser)
      //   done(null,user)
      // }
    } catch (error) {
      console.log(error.message)
    }
    //return done(null, profile);
  }
));
passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user))