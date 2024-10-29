import { createContext, useContext, useState } from "react";

export const LeavesContext = createContext();

export const LeavesProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);  

  return (
    <LeavesContext.Provider value={{ leaves, setLeaves }}>
      {children}
    </LeavesContext.Provider>
  );
};

export const useLeavesContext = () => useContext(LeavesContext);
