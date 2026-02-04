import xlsx from "xlsx";
import Book from "../models/book.model.js";
import { sheetToJson } from "../services/sheetToJson.js";

async function addOneBook(req, res) {

    const isbn = req.body.isbn ?? null;
    const title = req.body.title ?? null;
    const author = req.body.author ?? null;
    const department = req.body.department ?? null;
    const copies = req.body.copies ?? null;
    const description = req.body.description ?? null;
    const publisher = req.body.publisher ?? null;
    const edition = req.body.edition ?? null;
    const cover_url = req.body.cover_url ?? null;

    // validate required fields
    if (!title || !department) {
        return res.status(400).json({
            status: "failed",
            message: "title and department are required",
        });
    }

    try {
        // add record
        const book = await Book.create({
            title,
            author,
            isbn,
            department,
            copies,
            description,
            publisher,
            edition,
            cover_url
        });

        console.log("One Book Added");

        return res.status(201).json({
            status: "success",
            message: "Book added successfully",
            data: book
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error",
            error: error.message
        });
    }
}

async function addBulkBookFromSheet(req, res) {
    try {
        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an excel file." });
        }

        // 2. Parse the buffer from memory (Multer storage)
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

        // 3. Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // 4. Call your conversion and database logic
        const result = await sheetToJson(sheet);

        // 5. Send Response
        if (result.success) {
            return res.status(200).json({
                message: "Books imported successfully",
                count: result.count,
                books: result.result
            });
        } else {
            // This handles cases where sheetToJson returned an error object
            throw result;
        }

    } catch (error) {
        console.error("Bulk Upload Error:", error);
        res.status(500).json({
            message: "Failed to process sheet",
            error: error.message
        });
    }
}

export { addOneBook, addBulkBookFromSheet };