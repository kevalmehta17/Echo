import express from "express";

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.controller.js";

import { vertifyToken } from "../middleware/auth.js";

const router = express.Router();

//Read
router.get("/:id", vertifyToken, getUser);
router.get("/friends/:id", vertifyToken, getUserFriends);

//Update
router.patch("/:id/:friendId", vertifyToken, addRemoveFriend);

export default router;
