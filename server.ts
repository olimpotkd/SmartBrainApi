import express, { Request, Response } from "express";
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
app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());

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
