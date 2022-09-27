import ExpressAdapter from "./infra/api/ExpressAdapter";
import Router from "./infra/api/Router";
import PostgreSQLAdapter from "./infra/database/PostgreSQLAdapter";
import TransactionDatabaseRepository from "./infra/TransactionDatabaseRepository";

const connection = new PostgreSQLAdapter();
const transactionRepository = new TransactionDatabaseRepository(connection);

const httpServer = new ExpressAdapter();
const router = new Router(httpServer, transactionRepository);
router.init();
httpServer.listen(3000);
