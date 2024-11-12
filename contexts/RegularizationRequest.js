import { createContext, useContext, useState } from "react";

export const RegularizationContext = createContext();

export const RegularizationProvider = ({ children }) => {
  const [regularizationRequest, setRegularizationRequest] = useState([]);  

  return (
    <RegularizationContext.Provider
      value={{ regularizationRequest, setRegularizationRequest }}
    >
      {children}
    </RegularizationContext.Provider>
  );
};

export const useRegularization = () => useContext(RegularizationContext);
