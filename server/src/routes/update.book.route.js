import router from "express";
import updateBookController from "../controllers/update.book.controller.js";
import isAdminLoged from "../middlewares/checkAdminLogedIn.js";

const updateBookRouter = router();

updateBookRouter.patch("/book/:id", isAdminLoged, updateBookController);

export default updateBookRouter;
