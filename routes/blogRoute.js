import express from 'express';
import { createBlog, getAllBlogs, getMyBlogs, getBlogById, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getBlogs',protect,  getAllBlogs);
router.get("/myblogs", protect, getMyBlogs);
router.post('/createBlog',protect, createBlog);
router.get("/:id", protect, getBlogById);
router.put('/:id',protect, updateBlog);
router.delete('/:id',protect, deleteBlog);

export default router;