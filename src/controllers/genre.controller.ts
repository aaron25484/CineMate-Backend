import { Request, Response } from "express";
import { prismaClient } from "../db/client";
import { convertToType } from "../utils/utils";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prismaClient.genre.findMany();

    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getGenre = async (req: Request, res: Response) => {
  const {
    params: { genreId },
  } = req;

  try {
    const genre = await prismaClient.genre.findUnique({
      where: { id: convertToType(genreId) },
      include: {
        movies: {
          include: {
            genre: true,
          },
        },
      },
    });

    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    if (!name) throw new Error("Missing field");

    const newGenre = await prismaClient.genre.create({ data: { name } });

    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const {
    params: { genreId },
  } = req;

  try {
    if (!genreId) {
      return res.status(400).send("Genre ID is required");
    }

    const deletedGenre = await prismaClient.genre.delete({
      where: { id: convertToType(genreId) },
    });

    if (!deletedGenre) {
      return res.status(404).send("Genre not found");
    }

    res
      .status(200)
      .json({ message: "Genre deleted successfully", deletedGenre });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params;
  const { name } = req.body;

  try {
    const genre = await prismaClient.genre.update({
      where: { id: convertToType(genreId) },
      data: { name: name },
    });
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json(error);
  }
};
