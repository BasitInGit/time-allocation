import { createContext, useContext, useState, useEffect } from "react";
import { getActualWeeklyDistribution } from "../utils/analytics";
import { getTasksForWeek, getWeekRangeLabel } from "../utils/dateUtils";

const AppContext = createContext();

export function AppProvider({ children }) {
  // GLOBAL STATE

  const [tasks, setTasks] = useState([]);
  const [timeDistribution, setTimeDistribution] = useState([]);
  const [preferences, setPreferences] = useState({
  isPersonalised: false,
  });

  const isPersonalised = preferences?.isPersonalised;

  const defaultTask = {
  id: "",
  title: "",
  category: "Academic",
  date: "",
  time: "",
  duration: "",
  details: "",
  reminder: false,
  reminderDate: "",
  reminderTime: "",
  frequency: "once",
  color: "bg-gray-500",
  isCompleted: false,
};

  //  Add task
const addTask = (task) => {
  const newTask = {
    ...defaultTask,
    ...task,
    id: Date.now(),
  };

  setTasks(prev => [...prev, newTask]);
};

//  Delete task
const deleteTask = (id) => {
  setTasks(prev => prev.filter(task => task.id !== id));
};

const updateTask = (updatedTask) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    )
  );
};

// Toggle complete
const toggleComplete = (id) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === id
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    )
  );
};

const sortTasksByTime = (taskList) => {
  return [...taskList].sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );
};

const getUpcomingTasks = () => {
  const now = new Date();

  return tasks
    .filter(task => !task.isDeadline && !task.isCompleted && task.time && task.date)
    .filter(task => {
      const taskDateTime = new Date(`${task.date}T${task.time}`);
      return taskDateTime >= now; // only future tasks
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 3); // first 3 upcoming
};

const getReminderTasks = () => {
  const now = new Date();

  return tasks
    .filter(task => task.reminder && task.reminderDate && task.reminderTime)
    .filter(task => {
      const reminderDateTime = new Date(
        `${task.reminderDate}T${task.reminderTime}`
      );
      return reminderDateTime >= now;
    })
    .sort(
      (a, b) =>
        new Date(`${a.reminderDate}T${a.reminderTime}`) -
        new Date(`${b.reminderDate}T${b.reminderTime}`)
    )
    .slice(0, 3);
};

const getWeeklyActualDistribution = () => {
  const weeklyTasks = getTasksForWeek(tasks);
  return getActualWeeklyDistribution(weeklyTasks);
};

const weekLabel = getWeekRangeLabel();

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const normalizedTasks = savedTasks.map(task => ({
    ...defaultTask,
    ...task,
    }));
    setTasks(normalizedTasks);

    const savedPrefs = JSON.parse(localStorage.getItem("preferences")) || {};
    setPreferences({
      isPersonalised: false,
      ...savedPrefs,
    });

    const savedDist = JSON.parse(localStorage.getItem("timeDistribution")) || [];

    setPreferences(savedPrefs);
    setTimeDistribution(savedDist);
  }, []);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem("timeDistribution", JSON.stringify(timeDistribution));
  }, [timeDistribution]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        defaultTask,
        addTask,
        deleteTask,
        updateTask,
        toggleComplete,

        getUpcomingTasks,
        getReminderTasks,
        getWeeklyActualDistribution,
        weekLabel,

        preferences,
        setPreferences,
        isPersonalised,
        timeDistribution,
        setTimeDistribution,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useAppContext() {
  return useContext(AppContext);
}