import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import shipmentsRouter from "./shipments";
import carrierAgreementRouter from "./carrier-agreement";
import adminAuthRouter from "./admin/auth";
import adminShipmentsRouter from "./admin/shipments";
import adminLeadsRouter from "./admin/leads";
import adminUsersRouter from "./admin/users";
import adminRolesRouter from "./admin/roles";
import adminLoadsRouter from "./admin/loads";
import adminRateConfirmationsRouter from "./admin/rate-confirmations";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(shipmentsRouter);
router.use(carrierAgreementRouter);
router.use(adminAuthRouter);
router.use(adminShipmentsRouter);
router.use(adminLeadsRouter);
router.use(adminUsersRouter);
router.use(adminRolesRouter);
router.use(adminLoadsRouter);
router.use(adminRateConfirmationsRouter);
router.use(storageRouter);

export default router;
