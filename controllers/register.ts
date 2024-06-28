import { Request, Response } from "express";
import { Knex } from "knex";
import bcrypt from "bcrypt-nodejs";

const handleRegister = (req: Request, res: Response, db: Knex) => {
  const {
    email,
    name,
    password,
  }: { email: string; name: string; password: string } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        hash: hash,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        db("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));
};

export { handleRegister };
