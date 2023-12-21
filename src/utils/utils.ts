import { DATA_SOURCE } from "../db/client";
import fs from "fs-extra";
import { Request, Response } from "express";
import { uploadImage } from "../utils/cloudinary";

export const convertToType = (id: string) => {
  if (DATA_SOURCE === "postgres") {
    return Number(id);
  } else {
    return id;
  }
};

export const uploadPosterWithCloudinary = async (
  req: Request,
  res: Response
) => {
  try {
    const poster = req.files?.image;
    let posterUploaded = null;

    if (poster) {
      if ("tempFilePath" in poster) {
        posterUploaded = await uploadImage(poster.tempFilePath);
        await fs.unlink(poster.tempFilePath);
      }
    }
    res.send({ message: "Upload Request Success", data: posterUploaded });
  } catch (error) {
    console.error("Error uploading poster:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
