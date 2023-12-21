import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
  getUserWatchlist,
  deleteFromWatchlist,
  createUser,
  addToWatchlist,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/", createUser);
userRoutes.delete("/:userId", deleteUser);
userRoutes.patch("/:email/watchlist", addToWatchlist);
userRoutes.get("/:email/watchlist", getUserWatchlist);
userRoutes.delete("/:email/watchlist", deleteFromWatchlist);
userRoutes.get("/:email", getUser);
userRoutes.patch("/:email", updateUser);

export default userRoutes;
