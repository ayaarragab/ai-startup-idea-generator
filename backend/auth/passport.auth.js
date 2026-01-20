import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import dotenv from 'dotenv';
import db from "../models/index.js";

const { User } = db;
dotenv.config();


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID:     GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ where: { email: profile.email }})
    if (user && user.provider !== 'google') {
      await user.update({ provider: 'google and github', googleId: profile.id });
    }
    if (!user) {
    user = await User.create({
      googleId: profile.id,
      email: profile.email,
      provider: 'Google',
      username: profile.displayName,
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture
    });
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
  }
));


passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

export default passport;