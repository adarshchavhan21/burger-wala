const passport = require('passport');
const {Strategy: GoogleStrategy} = require('passport-google-oauth20');
const User = require('../models/User');

exports.connectPassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done)=> {
        const user = await User.findOne({googleId: profile.id});

        if(!user){
            const newUser = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                photo: profile.photos[0].value
            })
            done(null, newUser);
        }else{
            done(null, user);
        }
    }));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    })

    passport.deserializeUser(async(id, done)=> {
        const user = await User.findById(id);
        done(null, user);
    })
}

