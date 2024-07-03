import express, { Request, Response } from "express";
import cors from "cors";
import knex from "knex";
import * as register from "./controllers/register";
import * as profile from "./controllers/profile";
import * as signin from "./controllers/signin";
import * as image from "./controllers/image";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite",
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signin", (req: Request, res: Response) => {
  signin.handleSignIn(req, res, db);
});

app.post("/register", (req: Request, res: Response) => {
  register.handleRegister(req, res, db);
});

app.get("/profile/:id", (req: Request, res: Response) => {
  profile.getProfileById(req, res, db);
});

app.put("/image", (req: Request, res: Response) => {
  image.updateEntries(req, res, db);
});
app.post("/imageUrl", (req: Request, res: Response) => {
  image.handleAPICall(req, res);
});

const port = <string>process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port ", port);
});
