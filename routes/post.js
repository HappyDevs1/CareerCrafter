import express from 'express';

import { createPOst, deletePost, getPosts, updatePost } from '../controllers/post.js';

const router = express.Router();

router.get("/", getPosts);

router.post("/", createPOst);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;