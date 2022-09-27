import CreateTransaction from "../../application/CreateTransaction";
import GetTransaction from "../../application/GetTransaction";
import PostgreSQLAdapter from "../database/PostgreSQLAdapter";
import TransactionDatabaseRepository from "../TransactionDatabaseRepository";
import HttpServer from "./HttpServer";

export default class Router {
  constructor(readonly httpServer: HttpServer) {}

  async init() {
    const connection = new PostgreSQLAdapter();
    const transactionRepository = new TransactionDatabaseRepository(connection);

    this.httpServer.on(
      "post",
      "/transactions",
      async function (params: any, body: any) {
        const createTransaction = new CreateTransaction(transactionRepository);
        await createTransaction.execute(body);
      }
    );

    this.httpServer.on(
      "get",
      "/transactions:/code",
      async function (params: any, body: any) {
        const getTransaction = new GetTransaction(transactionRepository);
        const transaction = await getTransaction.execute(params.code);
        return transaction;
      }
    );
  }
}
