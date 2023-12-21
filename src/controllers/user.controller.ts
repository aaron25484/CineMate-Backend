import { Request, Response } from "express";
import { prismaClient } from "../db/client";
import { convertToType } from "../utils/utils";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findMany();

    res.status(201).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const {
    params: { email },
  } = req;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: convertToType(email) },
      include: { movies: true },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(200).json(existingUser);
    } else {
      const newUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password: "",
          movies: {
            create: [],
          },
        },
      });

      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const {
    params: { userId },
  } = req;

  try {
    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const deletedUser = await prismaClient.user.delete({
      where: { id: convertToType(userId) },
    });

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { name, password } = req.body;

  try {
    const updatedUser = await prismaClient.user.update({
      where: { email: convertToType(email) },
      data: { name, password },
      select: { name: true, password: true, updatedAt: true },
    });
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserWatchlist = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await prismaClient.user.findUnique({
      where: { email: convertToType(email) },
      include: { movies: true },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const watchlist = user.watchlist;

    res.status(200).json(watchlist);
  } catch (error) {
    console.error("Error fetching user watchlist:", error);

    res.status(500).json(error);
  }
};

export const addToWatchlist = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { movieId } = req.body;

  try {
    if (!email || !movieId) {
      throw new Error("User ID and Movie ID are required");
    }

    const user = await prismaClient.user.findUnique({
      where: { email: convertToType(email) },
    });

    const isMovieInWatchlist = user.watchlist.includes(convertToType(movieId));

    if (isMovieInWatchlist) {
      return res
        .status(400)
        .json({ message: "Movie is already in the watchlist" });
    }

    user?.watchlist.push(convertToType(movieId));

    const updatedUser = await prismaClient.user.update({
      where: {
        email: convertToType(email),
      },
      data: {
        watchlist: user?.watchlist,
      },
    });

    res.status(200).json({ message: "Movie added to watchlist", updatedUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteFromWatchlist = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { movieId } = req.body;
  try {
    const user = await prismaClient.user.findUnique({
      where: { email: convertToType(email) },
    });
    const deleteMovieFromWatchlist = user?.watchlist.filter(
      (email: string | number) => email !== movieId
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    await prismaClient.user.update({
      where: {
        email: convertToType(email),
      },
      data: {
        watchlist: deleteMovieFromWatchlist,
      },
    });

    res.status(200).json({ message: "Movie deleted from user successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
