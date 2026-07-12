import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import shipmentsRouter from "./shipments";
import adminAuthRouter from "./admin/auth";
import adminShipmentsRouter from "./admin/shipments";
import adminLeadsRouter from "./admin/leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(shipmentsRouter);
router.use(adminAuthRouter);
router.use(adminShipmentsRouter);
router.use(adminLeadsRouter);

export default router;
