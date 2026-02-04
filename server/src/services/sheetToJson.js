import Book from "../models/book.model.js"; // Adjust path as needed
import xlsx from "xlsx";

export async function sheetToJson(sheet) {
    try {
        // 1. Convert sheet to raw JSON
        const rawData = xlsx.utils.sheet_to_json(sheet);

        // 2. Map to group books (Title + ISBN as key) to handle 'copies' array
        const booksMap = new Map();

        for (const row of rawData) {
            // Fix typos from the Excel headers
            const title = row.tittle?.toString().trim();
            const isbn = row.isbn?.toString().trim() || null;
            const acc = row.acc?.toString().trim();

            if (!title) continue; // Skip if title is missing

            const key = isbn ? `${title}-${isbn}` : title;

            if (booksMap.has(key)) {
                // If book exists, add the new accession number to the copies array
                const existing = booksMap.get(key);
                if (acc && !existing.copies.includes(acc)) {
                    existing.copies.push(acc);
                }
            } else {
                // Create new book object based on your Schema
                booksMap.set(key, {
                    title: title,
                    description: row.description || "",
                    author: row.auther || "Unknown",
                    department: (row.departement || "AGRICULTURE").toUpperCase(),
                    isbn: isbn === "" ? undefined : isbn, // Avoid duplicate empty strings
                    publisher: row.publisher || "",
                    edition: row.edition?.toString() || "",
                    cover_url: row.cover_url || "",
                    copies: acc ? [acc] : [],
                    isAvailable: true,
                    views: 0,
                    updatedAt: new Date()
                });
            }
        }

        const finalDocs = Array.from(booksMap.values());

        // 3. Insert into MongoDB
        // ordered: false allows the rest to succeed if one document hits a duplicate error
        const result = await Book.insertMany(finalDocs, { ordered: false });

        return { success: true, count: result.length };

    } catch (error) {
        console.log("Error processing sheet:", error.message);
        // Handle partial success (some duplicates might have been skipped)
        if (error.code === 11000) {
            return { success: true, message: "Imported with some duplicates skipped." };
        }
        return error;
    }
}