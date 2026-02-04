import router from "express";
import multer from 'multer';
import { addBulkBookFromSheet, addOneBook } from "../controllers/add.book.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addBookRouter = router();

addBookRouter.post("/one", addOneBook);

addBookRouter.post("/bulk/excel", upload.single("file"), addBulkBookFromSheet);

export default addBookRouter;