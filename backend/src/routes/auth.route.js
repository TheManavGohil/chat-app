import express from 'express'
import passport from "passport";
import "../lib/passport.js"
import { checkAuth, login, logout, signup, updateProfile } from '../controller/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { generateToken } from '../lib/utils.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login) 
router.post('/logout', logout)

router.put('/update-profile', protectRoute ,updateProfile)

router.get('/check', protectRoute, checkAuth)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5174/login" }),
  (req, res) => {
    // Generate a JWT token for the authenticated user
    if (req.user) {
      generateToken(req.user._id, res);
    }
    res.redirect("http://localhost:5174/profile"); 
  }
)

export default router
