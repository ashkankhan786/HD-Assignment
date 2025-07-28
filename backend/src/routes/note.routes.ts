import express from "express";
import authMiddleware from "../middlewares/auth";
import {
  createNote,
  deleteNote,
  getNotes,
} from "../controllers/note.controller";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);

export default router;
