import { Request, Response } from "express";
import { Knex } from "knex";
import bcrypt from "bcrypt";

const handleRegister = (req: Request, res: Response, db: Knex) => {
  const saltRounds = 10;
  const {
    email,
    name,
    password,
  }: { email: string; name: string; password: string } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  const hash = bcrypt.hashSync(password, saltRounds);

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        hash: hash,
      })
      .into("login")
      .then(() => {
        return trx.raw("SELECT last_insert_rowid() as id");
      })
      .then((result) => {
        const loginId = result[0].id;
        return trx("users")
          .insert({
            email: email,
            name: name,
            joined: new Date(),
          })
          .then(() => {
            return trx("users").where({ email: email }).first();
          });
      })
      .then((user) => {
        trx.commit();
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        trx.rollback();
        res.status(400).json("Unable to register");
      });
  }).catch((err) => {
    // Handle any errors that fall through
    console.log(err);
    res.status(400).json("Unable to register");
  });
};

export { handleRegister };
