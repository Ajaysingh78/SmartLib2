import Router from "express";
import changeVisiblityOfBook from "../controllers/feature.controller.js";

const router = Router();

router.patch("/change-visiblity/:id", changeVisiblityOfBook);

export default router;