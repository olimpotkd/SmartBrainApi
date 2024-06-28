const Clarifai = require("clarifai");
import { Request, Response } from "express";
import { Knex } from "knex";

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

const handleAPICall = (req: Request, res: Response) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data: any) => res.json(data))
    .catch((err: any) => res.status(400).json("Unable to work with API"));
};

const updateEntries = (req: Request, res: Response, db: Knex) => {
  console.log(req.body);
  const { id, currentEntries } = req.body;

  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (!entries.length) {
        return res.status(404).json("Unable to update entries");
      }
      res.json(entries);
    })
    .catch((err) => {
      return res.status(404).json("Unable to update entries");
    });
};

export { updateEntries, handleAPICall };
