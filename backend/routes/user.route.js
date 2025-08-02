import express from 'express';
import {
    editProfile,
    followOrUnfollow,
    register,
    login,
    logout,
    getProfile,
    getSuggestedUsers
} from '../controllers/user.controller.js';
import isAuthenticated from "../middleware/isAuthenticated.js"
import upload from '../middleware/multer.js';


const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').post(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile)
router.route('/suggested').get(isAuthenticated, getSuggestedUsers)
router.route('/followOrUnfollow/:id/').post(isAuthenticated, followOrUnfollow);

export default router
