import express, { Request, Response } from "express";
import pgp from "pg-promise";
import CreateTransaction from "../../application/CreateTransaction";
import GetTransaction from "../../application/GetTransaction";
import PostgreSQLAdapter from "../database/PostgreSQLAdapter";
import TransactionDatabaseRepository from "../TransactionDatabaseRepository";
import HttpServer from "./HttpServer";

export default class Router {
  constructor(readonly httpServer: HttpServer) {}

  async init() {
    this.httpServer.on(
      "post",
      "/transactions",
      async function (req: Request, res: Response) {
        const createTransaction = new CreateTransaction(transactionRepository);
        await createTransaction.execute(req.body);
        res.end();
      }
    );

    this.httpServer.on(
      "get",
      "/transactions:/code",
      async function (req: Request, res: Response) {
        const getTransaction = new GetTransaction(transactionRepository);
        const transaction = await getTransaction.execute(req.params.code);
        res.json(transaction);
      }
    );

    const app = express();
    app.use(express.json());
    const connection = new PostgreSQLAdapter();
    const transactionRepository = new TransactionDatabaseRepository(connection);

    app.listen(3000);
  }
}
