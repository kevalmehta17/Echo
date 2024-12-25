import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likedPost,
} from "../controllers/posts.controller.js";
import { vertifyToken } from "../middleware/auth.js";
