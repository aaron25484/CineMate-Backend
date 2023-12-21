import { Document, Schema, model } from "mongoose";

interface IGenreDocument extends Document {
  name: string;
  movies?: string[];
}

const genreSchema = new Schema<IGenreDocument>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  movies: [
    {
      type: Schema.Types.ObjectId,
      ref: "movies",
    },
  ],
});

export const genreModel = model<IGenreDocument>("genre", genreSchema);
