import express, { Request, Response } from "express";
import pgp from "pg-promise";

const app = express();
app.use(express.json());
app.post("/transactions", async function (req: Request, res: Response) {
  const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
  await connection.$pool.end();
  console.log(req.body);
  res.end();
});
app.listen(3000);
