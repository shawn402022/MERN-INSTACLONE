import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, disLikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller.js';


const router = express.Router();

router.route('/addPost').post(isAuthenticated, upload.single('image'), addNewPost)
router.route('/all').get(isAuthenticated, getAllPost)
router.route('/userPost/all').get(isAuthenticated, getUserPost)
router.route('/:id/like').get(isAuthenticated, likePost)
router.route('/:id/dislike').get(isAuthenticated, disLikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost)
router.route('/delete/:id').delete(isAuthenticated, deletePost)
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost)

export default router
