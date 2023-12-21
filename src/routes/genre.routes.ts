import { Router } from "express";
import {
  createGenre,
  getAllGenres,
  deleteGenre,
  updateGenre,
  getGenre,
} from "../controllers/genre.controller";

const genreRoutes = Router();

genreRoutes.get("/", getAllGenres);
genreRoutes.get("/:genreId", getGenre);
genreRoutes.post("/", createGenre);
genreRoutes.delete("/:genreId", deleteGenre);
genreRoutes.patch("/:genreId", updateGenre);

export default genreRoutes;
