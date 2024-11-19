import { createContext, useContext, useState } from "react";

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasksList, setTasksList] = useState([]);

  return (
    <TasksContext.Provider value={{ tasksList, setTasksList }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
