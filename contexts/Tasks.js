import { createContext, useContext, useState } from "react";
import tasks from "@/constants/tasks";
export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasksList, setTasksList] = useState(tasks);

  return (
    <TasksContext.Provider value={{ tasksList, setTasksList }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
