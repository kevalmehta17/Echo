import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/posts.controller.js";
import { vertifyToken } from "../middleware/auth.js";

const router = express.Router();

//READ
router.get("/", vertifyToken, getFeedPosts); //this give all the posts from database
router.get("/:userId/posts"); //this give all the posts of a specific user

//UPDATE
router.patch("/:id/like", vertifyToken, likePost);

export default router;
