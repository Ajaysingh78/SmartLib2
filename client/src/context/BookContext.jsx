import { createContext, useState, useMemo } from "react";

export const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [allBooks, setAllBooks] = useState([]);

  const value = useMemo(() => ({ allBooks, setAllBooks }), [allBooks]);

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}
