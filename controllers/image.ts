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

  db.transaction((trx) => {
    trx("users")
      .where({ id })
      .increment("entries", 1)
      .then(() => {
        return trx("users").where({ id }).select("entries");
      })
      .then((entries) => {
        if (!entries.length) {
          throw new Error("Unable to find user");
        }
        res.json(entries[0]);
      })
      .then(trx.commit)
      .catch((err) => {
        trx.rollback();
        res.status(404).json("Unable to update entries");
      });
  }).catch((err) => {
    // This catch is for any errors that might slip through the transaction handling
    res.status(404).json("Unable to update entries");
  });
};

export { updateEntries, handleAPICall };
