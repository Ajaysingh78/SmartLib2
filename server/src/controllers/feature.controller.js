import Book from "../models/book.model.js";

async function changeVisiblityOfBook(req, res) {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        book.isAvailable = !book.isAvailable;
        await book.save();
        return res.status(200).json({ status: "success", message: "Book visibility changed successfully" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

export default changeVisiblityOfBook;