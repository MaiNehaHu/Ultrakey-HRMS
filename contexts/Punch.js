import { createContext, useContext, useState } from "react";

export const PunchContext = createContext();

export const PunchProvider = ({ children }) => {
  const [punchedIn, setPunchedIn] = useState(false);

  return (
    <PunchContext.Provider value={{ punchedIn, setPunchedIn }}>
      {children}
    </PunchContext.Provider>
  );
};

export const usePunching = () => useContext(PunchContext);
