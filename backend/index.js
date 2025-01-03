import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.controller.js";
import { createPost } from "./controllers/posts.controller.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/users.route.js";
import postRoutes from "./routes/posts.route.js";
import { vertifyToken } from "./middleware/auth.js";
import User from "./models/user.model.js";
import Post from "./models/posts.model.js";
import { users, posts } from "./data/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet()); //secure express app by setting various HTTP headers

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
); //Setting the policy to "cross-origin" allows resources (like images or fonts) to be shared across different origins.

app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // This allows all origins to make requests to your server.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", vertifyToken, upload.single("picture"), createPost);

const PORT = process.env.PORT || 6001;
// MONGOOSE SETUP
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);

      //Add dummy data only for the oneTime
      // User.insertMany(users);
      // Post.insertMany(posts);
    });
  })
  .catch((error) => console.log(error));
// mongodb+srv://ironman:ironman123@cluster0.clkcr.mongodb.net/
