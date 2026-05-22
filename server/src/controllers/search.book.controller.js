import Book, { FACULTIES, FACULTY_DEPARTMENTS } from "../models/book.model.js";

// ─── OLD DEPT FALLBACK MAP ────────────────────────────────────────────────────
// Purane books ke liye fallback (migration ke baad bhi kaam kare)
const FACULTY_TO_OLD_DEPTS = {
  "Engineering & Technology":  ["CSE","IT","ECE","EEE","MECH","CIVIL"],
  "Computer Applications":     ["BCA","MCA"],
  "Management & Commerce":     ["MBA","BBA","B.COM","B.DES","B.MS","B.AS","B.FA","B.FT","B.HM"],
  "Science":                   ["B.SC"],
  "Agriculture":               ["AGRICULTURE"],
  "Pharmacy":                  ["B.PHARM","B.PHARMA","D.PHARM","D.PHARMA"],  // ✅ FIXED
  "Medical & Allied Health":   ["B.PT","AYURVEDA"],                           // ✅ FIXED
  "Law":                       ["LAW","B.LLB"],
  "Architecture & Planning":   ["B.ARCH"],
  "Arts & Humanities":         ["B.ED","M.ED","B.FA","B.FT"],
  "Competitive Exams":         [],
  "Research & Reference":      [],
  "Non-Academic":              [],
};

const DEPT_TO_OLD_DEPT = {
  "CSE":         "CSE",
  "IT":          "IT",
  "EC":          "ECE",
  "Electrical":  "EEE",
  "Mechanical":  "MECH",
  "Civil":       "CIVIL",
  "BCA":         "BCA",
  "MCA":         "MCA",
  "MBA":         "MBA",
  "BBA":         "BBA",
  "B.Com":       "B.COM",
  "B.Sc":        "B.SC",
  "Agriculture": "AGRICULTURE",
  "B.Pharm":     "B.PHARM",    // ✅ FIXED
  "D.Pharma":    "D.PHARM",    // ✅ FIXED
  "Ayurveda":    "AYURVEDA",   // ✅ FIXED
  "LLB":         "LAW",
  "B.Arch":      "B.ARCH",
};

// ─── PAGINATION ───────────────────────────────────────────────────────────────
const getPagination = (req) => {
  const page  = Math.max(parseInt(req.query.page,  10) || 1,  1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ─── BUILD QUERY ──────────────────────────────────────────────────────────────
const buildBookQuery = (query = {}) => {
  const filter = {};

  const searchTerm   = String(query.q || query.search || query.title || "").trim();
  const faculty      = String(query.faculty     || "").trim();
  const department   = String(query.department  || "").trim();
  const availability = String(query.availability|| "").trim().toLowerCase();
  const language     = String(query.language    || "").trim();

  // ── Search ────────────────────────────────────────────────────────
  if (searchTerm) {
    if (searchTerm.length >= 3) {
      filter.$text = { $search: searchTerm };
    } else {
      const safe = escapeRegex(searchTerm);
      filter.$or = [
        { title:  { $regex: safe, $options: "i" } },
        { author: { $regex: safe, $options: "i" } },
        { isbn:   { $regex: safe, $options: "i" } },
      ];
    }
  }

  // ── Faculty Filter ────────────────────────────────────────────────
  // Naye books: faculty field
  // Purane books: old department field (fallback)
  if (faculty && faculty.toLowerCase() !== "all" && FACULTIES.includes(faculty)) {
    const oldDepts = FACULTY_TO_OLD_DEPTS[faculty] || [];
    if (oldDepts.length > 0) {
      filter.$or = [
        { faculty: faculty },
        { department: { $in: oldDepts } },
      ];
    } else {
      filter.faculty = faculty;
    }
  }

  // ── Department Filter ─────────────────────────────────────────────
  if (department && department.toLowerCase() !== "all") {
    const oldDept = DEPT_TO_OLD_DEPT[department];
    if (oldDept) {
      filter.$or = [
        { departments: { $in: [department] } },
        { department: oldDept },
      ];
    } else {
      filter.departments = { $in: [department] };
    }
  }

  // ── Availability ──────────────────────────────────────────────────
  if (availability === "available")   filter.isAvailable = true;
  if (availability === "unavailable") filter.isAvailable = false;

  // ── Language ──────────────────────────────────────────────────────
  if (language && language.toLowerCase() !== "all") filter.language = language;

  return filter;
};

// ─── BUILD SORT ───────────────────────────────────────────────────────────────
const buildSort = (query = {}, hasTextSearch = false) => {
  if (hasTextSearch) return { score: { $meta: "textScore" }, views: -1 };
  switch (String(query.sort || "").trim().toLowerCase()) {
    case "views":      return { views: -1 };
    case "title_asc":  return { title: 1 };
    case "title_desc": return { title: -1 };
    case "newest":     return { createdAt: -1 };
    case "oldest":     return { createdAt: 1 };
    default:           return { views: -1 };
  }
};

// ─── SEARCH BY PAGE ───────────────────────────────────────────────────────────
async function searchByPage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter        = buildBookQuery(req.query);
    const hasTextSearch = !!filter.$text;
    const sort          = buildSort(req.query, hasTextSearch);
    const selectFields  = hasTextSearch ? { score: { $meta: "textScore" } } : {};

    const [books, total] = await Promise.all([
      Book.find(filter, selectFields).sort(sort).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      pagination: { totalItems: total, currentPage: page, totalPages: Math.ceil(total / limit), pageSize: limit },
      data: books,
    });
  } catch (error) {
    console.error("searchByPage:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── SEARCH BY TITLE ──────────────────────────────────────────────────────────
async function searchBookByTitle(req, res) {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ status: "failed", message: "Title is required" });
    const books = await Book.find(buildBookQuery({ title })).limit(20).lean();
    return res.status(200).json({ status: "success", count: books.length, data: books });
  } catch (error) {
    console.error("searchBookByTitle:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── SEARCH BY VIEWS ──────────────────────────────────────────────────────────
async function searchByViews(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const [books, total] = await Promise.all([
      Book.find().sort({ views: -1 }).skip(skip).limit(limit).lean(),
      Book.countDocuments(),
    ]);
    return res.status(200).json({
      status: "success",
      pagination: { totalItems: total, currentPage: page, totalPages: Math.ceil(total / limit), pageSize: limit },
      data: books,
    });
  } catch (error) {
    console.error("searchByViews:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── UNAVAILABLE BOOKS ────────────────────────────────────────────────────────
async function searchUnAvailbleBooks(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const [books, total] = await Promise.all([
      Book.find({ isAvailable: false }).skip(skip).limit(limit).lean(),
      Book.countDocuments({ isAvailable: false }),
    ]);
    return res.status(200).json({
      status: "success",
      pagination: { totalItems: total, currentPage: page, totalPages: Math.ceil(total / limit), pageSize: limit },
      data: books,
    });
  } catch (error) {
    console.error("searchUnAvailbleBooks:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── BOOKS WITHOUT IMAGE ──────────────────────────────────────────────────────
async function searchBooksWithoutImage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const q = { $or: [{ cover_url: { $exists: false } }, { cover_url: null }, { cover_url: "" }] };
    const [books, total] = await Promise.all([
      Book.find(q).skip(skip).limit(limit).lean(),
      Book.countDocuments(q),
    ]);
    return res.status(200).json({
      status: "success",
      pagination: { totalItems: total, currentPage: page, totalPages: Math.ceil(total / limit), pageSize: limit },
      data: books,
    });
  } catch (error) {
    console.error("searchBooksWithoutImage:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── FACULTY META ─────────────────────────────────────────────────────────────
async function getFacultyMeta(req, res) {
  try {
    return res.status(200).json({
      status: "success",
      data: { faculties: FACULTIES, facultyDepartments: FACULTY_DEPARTMENTS },
    });
  } catch (error) {
    console.error("getFacultyMeta:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

export {
  searchBookByTitle,
  searchByViews,
  searchByPage,
  searchUnAvailbleBooks,
  searchBooksWithoutImage,
  getFacultyMeta,
};