import { Request, Response } from "express";
import Note from "../models/Note";
import { CustomRequest } from "../middlewares/auth";

export const createNote = async (req: CustomRequest, res: Response) => {
  const note = await Note.create({
    content: req.body.content,
    user: req.userId,
  });
  res.json({ message: "Note successfully created", note });
};

export const getNotes = async (req: CustomRequest, res: Response) => {
  const notes = await Note.find({ user: req.userId });
  res.json({ message: "Fetched all the notes successfully", notes });
};

export const deleteNote = async (req: CustomRequest, res: Response) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Note deleted" });
};
