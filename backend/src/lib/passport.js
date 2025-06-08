import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js"; // Import your User model
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("ENV variables loaded:", {
  hasClientID: !!process.env.GOOGLE_CLIENT_ID,
  hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET
});

// For troubleshooting - store the clientID and secret in variables
// IMPORTANT: Replace these with your actual credentials if you need this fallback
// This is only for testing and should be removed in production
const clientID = process.env.GOOGLE_CLIENT_ID || "YOUR_ACTUAL_CLIENT_ID";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "YOUR_ACTUAL_CLIENT_SECRET";

const callbackURL = process.env.NODE_ENV === "development" ? "http://localhost:5001/api/auth/google/callback" : "https://chatty-z8cs.onrender.com/api/auth/google/callback"

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", JSON.stringify({
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value
        }));
        
        // Check if user already exists in DB
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user from Google data
          user = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails?.[0]?.value,
            profilePic: profile.photos?.[0]?.value,
          });
          
          console.log("Creating new user:", user);
          await user.save();
        } 
        else if (!user.googleId) {
          // If user exists but doesn't have a Google ID, update it
          user.googleId = profile.id;
          
          // Also update other Google profile info if needed
          if (!user.fullName) user.fullName = profile.displayName;
          if (!user.profilePic && profile.photos?.[0]?.value) user.profilePic = profile.photos[0].value;
          
          console.log("Updating existing user with Google data:", user);
          await user.save();
        }
        else {
          // Existing user with Google ID - update their info if needed
          let needsUpdate = false;
          
          if (!user.fullName && profile.displayName) {
            user.fullName = profile.displayName;
            needsUpdate = true;
          }
          
          if (!user.profilePic && profile.photos?.[0]?.value) {
            user.profilePic = profile.photos[0].value;
            needsUpdate = true;
          }
          
          if (needsUpdate) {
            console.log("Updating existing Google user:", user);
            await user.save();
          }
        }
        
        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
