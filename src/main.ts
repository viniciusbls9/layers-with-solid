import ExpressAdapter from "./infra/api/ExpressAdapter";
import Router from "./infra/api/Router";

const httpServer = new ExpressAdapter();
const router = new Router(httpServer);
router.init();
httpServer.listen(3000);
