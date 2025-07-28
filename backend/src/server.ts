import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server is listening on port ${PORT} Visit http://localhost:${PORT}`
    );
  });
});
