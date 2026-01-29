import router from "express";
import { addBulkBook, addOneBook } from "../controllers/add.book.controller.js";

const addBookRouter = router();

addBookRouter.post("/one", addOneBook);

addBookRouter.post("/bulk", addBulkBook);

export default addBookRouter;