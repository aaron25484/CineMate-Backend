import { Document, Schema, model } from "mongoose";

interface IMovieDocument extends Document {
  name: string;
  poster_img: string;
  score: number;
  genreId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const movieSchema = new Schema<IMovieDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    poster_img: {
      type: String,
      required: [true, "A poster is required"],
      unique: true,
    },
    score: {
      type: Number,
      required: [true, "A score is required"],
    },
    genreId: {
      type: String,
      required: [true, "A genre is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

export const movieModel = model<IMovieDocument>("movies", movieSchema);
