// server/src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const { vars } = require('./');

// Configure Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: vars.googleClientId,
            clientSecret: vars.googleClientSecret,
            callbackURL: vars.googleCallbackUrl,
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOrCreateFromGoogle(profile);
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
