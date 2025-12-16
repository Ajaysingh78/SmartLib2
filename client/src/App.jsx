
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import all enhanced components
import Header from "./components/Header";
import LibraryAdmin from "./pages/Adminpanel";
import HomePage from "./pages/HomePage";
import BookDetails from "./components/BookDetails";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Book Details Page */}
          <Route path="/book/:id" element={<BookDetails />} />

          <Route path="/admin" element={<LibraryAdmin />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
