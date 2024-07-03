import { Input, Model } from "clarifai-nodejs";
import { Request, Response } from "express";
import { Knex } from "knex";

const handleAPICall = (req: Request, res: Response) => {
  const input = Input.getInputFromUrl({
    inputId: "image",
    imageUrl: req.body.input,
  });

  const model = new Model({
    authConfig: {
      pat: <string>process.env.CLARIFAI_PAT,
      userId: <string>process.env.CLARIFAI_USERID,
      appId: <string>process.env.CLARIFAI_APPID,
    },
    modelId: "face-detection",
  });

  model
    .predict({ inputs: [input] })
    .then((data: any) => {
      res.json(data[0]);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(400).json("Unable to work with API");
    });
};

const updateEntries = (req: Request, res: Response, db: Knex) => {
  console.log(req.body);
  const { id } = req.body;

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
