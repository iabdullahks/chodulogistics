import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import shipmentsRouter from "./shipments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(shipmentsRouter);

export default router;
