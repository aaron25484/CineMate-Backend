import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import genreRoutes from "./routes/genre.routes";
import movieRoutes from "./routes/movie.routes";
import cors from "cors";
import errorHandler from "./middleware/error.middleware";
import FileUpload from "express-fileupload";
import { checkJWTMiddleware } from "./middleware/checkJWT.middleware";
import prisma from "./db/client";

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
prisma.$connect().then(() => {
  console.log("Connected to MongoDB via Prisma");})

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/genres", genreRoutes);

app.get("/", (req,res)=>{
  res.status(200).json({message: "This is my CineMate backend"})
})

app.use(errorHandler);



export default app;
