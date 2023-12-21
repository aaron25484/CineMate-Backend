import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";

cloudinary.config(config.cloudinary);

export const uploadImage = async (imagePath: string) => {
  return await cloudinary.uploader.upload(imagePath, {
    resource_type: "image",
    folder: "backend/",
    crop: "scale",
    overwrite: true,
  });
};
