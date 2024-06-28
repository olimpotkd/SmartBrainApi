import express from "express";
import bodyParser from "body-parser";
// import cors from "cors";
import knex from "knex";
import * as register from "./controllers/register";
import * as profile from "./controllers/profile";
import * as signin from "./controllers/signin";
import * as image from "./controllers/image";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "mysql",
  connection: {
    host: process.env.DATABASE_URL,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

const app = express();
app.use(bodyParser.json());
// app.use(cors());

app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db);
});

app.get("/profile/:id", (req, res) => {
  profile.getProfileById(req, res, db);
});

app.put("/image", (req, res) => {
  image.updateEntries(req, res, db);
});
app.post("/imageUrl", (req, res) => {
  image.handleAPICall(req, res);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port ", port);
});
