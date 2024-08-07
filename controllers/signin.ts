import { Request, Response } from "express";
import { Knex } from "knex";
import bcrypt from "bcrypt";

const handleSignIn = (req: Request, res: Response, db: Knex) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => {
            res.status(400).json("Unable to get user");
          });
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => {
      res.status(400).json("Wrong credentials");
    });
};

export { handleSignIn };
