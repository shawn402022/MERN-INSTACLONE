import express from'express';
import { editProfile, followOrUnfollow, register } from '../controllers/user.controller';
import { isAuthenticated } from "../middlesare/isAuthenticated.js"
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(register)
router.route('/logout').get(register)
router.route('/:id/profile').post(isAuthenticated, getProfile);
router.route('/profile/edit')/ pos(isAuthenticated, upload.single('profilePicture'), editProfile)
router.route('/suggested').get(isAuthenticated, getSuggestedUsers)
router.route('/followOrUnfollow:id/').post(isAuthenticated, followOrUnfollow );

export default router
