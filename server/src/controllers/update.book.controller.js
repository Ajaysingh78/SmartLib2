import bookModel from "../models/book.model.js";

async function updateBookController(req, res) {
    try {
        const { id } = req.params;   // one book → id from URL
        const updates = req.body;    // only changed fields

        const book = await bookModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                status: "failed",
                message: "Book not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        console.error("error in update book", error);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
}

export default updateBookController;
