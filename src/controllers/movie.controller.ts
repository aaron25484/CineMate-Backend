import { Request, Response } from "express";
import prisma from "../db/client";
import fs from "fs/promises";
import { uploadImage } from "../utils/cloudinary";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany();

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMovie = async (req: Request, res: Response) => {
  const {
    params: { movieId },
  } = req;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: (movieId) },
    });

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movieData = req.body;

    const newMovie = await prisma.movie.create({
      data: {
        name: movieData.name,
        score: Number(movieData.score),
        genre: {
          connect: { id: movieData.genre },
        },
        poster: movieData.poster,
      },
    });

    res.status(201).json({ message: "Movie created successfully", newMovie });
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Failed to create movie" });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;

  try {
    if (!movieId) {
      return res.status(400).send("Movie ID is required");
    }

    const deletedMovie = await prisma.movie.findUnique({
      where: { id: (movieId) },
      include: { genre: true, User: true },
    });

    if (!deletedMovie) {
      return res.status(404).send("Movie not found");
    }

    const genreId = deletedMovie.genre.id;

    await prisma.genre.update({
      where: { id: (genreId) },
      data: {
        movies: {
          disconnect: { id: (movieId) },
        },
      },
    });

    const userId = deletedMovie.User?.id;
    await prisma.user.update({
      where: { id: (userId) },
      data: {
        movies: {
          disconnect: { id: (movieId) },
        },
      },
    });

    await prisma.movie.delete({
      where: { id: (movieId) },
    });

    res
      .status(200)
      .json({ message: "Movie deleted successfully", deletedMovie });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const { name, poster, score, genre } = req.body;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: (movieId) },
    });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    const oldGenreId = movie.genreId;

    const updatedMovie = await prisma.movie.update({
      where: { id: (movieId) },
      data: {
        name,
        poster,
        score,
        genre: {
          connect: { name: genre },
        },
      },
      include: { genre: true },
    });

    if (genre && oldGenreId !== updatedMovie.genre.id) {
      await prisma.genre.update({
        where: { id: (oldGenreId) },
        data: { movies: { disconnect: { id: (movieId) } } },
      });

      await prisma.genre.update({
        where: { id: (updatedMovie.genre.id) },
        data: { movies: { connect: { id: (updatedMovie.id) } } },
      });
    }
    res.status(201).json(updateMovie);
  } catch (error) {
    res.status(500).json(error);
  }
};
