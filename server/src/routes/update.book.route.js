import router from "express";
import { updateBookController } from "../controllers/update.book.controller.js";

const updateBookRouter = router();

updateBookRouter.patch("/books/:id", updateBookController);

export default updateBookRouter;
