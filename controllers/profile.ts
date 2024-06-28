import { Request, Response } from "express";
import { Knex } from "knex";

const getProfileById = (req: Request, res: Response, db: Knex) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((users) => {
      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json("Not found");
      }
    });
};

export { getProfileById };
