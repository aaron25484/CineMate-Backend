import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import genreRoutes from "./routes/genre.routes";
import movieRoutes from "./routes/movie.routes";
import cors from "cors";
import errorHandler from "./middleware/error.middleware";
import FileUpload from "express-fileupload";
import { checkJWTMiddleware } from "./middleware/checkJWT.middleware";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(
  FileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
    limits: { fileSize: 10000000 },
    abortOnLimit: true,
  })
);

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/genres", genreRoutes);

app.use(errorHandler);

export default app;
