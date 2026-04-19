import { createContext, useContext, useState, useEffect } from "react";
import { getActualWeeklyDistribution } from "../utils/analytics";
import { getWeekRangeLabel, buildDateTime, getTasksForWeek } from "../utils/dateUtils";
import { timeToMinutesSafe } from "../utils/Scheduler/timeUtils";

const AppContext = createContext();

const defaultTask = {
  id: "",
  title: "",
  category: "Academic",
  date: "",
  time: "",
  duration: "",
  details: "",
  color: "bg-gray-500",
};

const defaultReminder = {
  id: "",
  taskId: "",
  reminderDate: "",
  reminderTime: "",
  frequency: "once",
};

const DEFAULT_DISTRIBUTION = [
  { name: "Academic", value: 25 },
  { name: "Work", value: 25 },
  { name: "Health", value: 25 },
  { name: "Leisure", value: 25 },
];

const DEFAULT_PREFERENCES = [
  {
    name: "Academic",
    preferredTime: "morning",
    intensity: "high",
  },
  {
    name: "Work",
    preferredTime: "afternoon",
    intensity: "medium",
  },
  {
    name: "Health",
    preferredTime: "morning",
    intensity: "medium",
  },
  {
    name: "Leisure",
    preferredTime: "evening",
    intensity: "low",
  },
];

export function AppProvider({ children }) {
  // GLOBAL STATE

  const [tasks, setTasks] = useState([]);
  const [timeDistribution, setTimeDistribution] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [schedulePreferences, setSchedulePreferences] = useState([]);

  const [generatedSchedule, setGeneratedSchedule] = useState({
    schedule: [],
    analysis: {
      totalHours: 0,
      recommendedIntensity: "Balanced",
      warning: null,
    },
  });

  //  Add task
const addTask = (task) => {
  const newTask = {
    ...defaultTask,
    ...task,
    id: crypto.randomUUID(),
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
      task.id === updatedTask.id
  ? { ...task, ...updatedTask }
  : task
    )
  );
};

const addReminder = (reminder) => {
  const newReminder = {
    ...reminder,
    id: crypto.randomUUID(),
  };

  setReminders(prev => [...prev, newReminder]);
};

const updateReminder = (updatedReminder) => {
  setReminders(prev =>
    prev.map(reminder =>
      reminder.id === updatedReminder.id
        ? { ...reminder, ...updatedReminder }
        : reminder
    )
  );
};

const deleteReminder = (id) => {
  setReminders(prev => prev.filter(r => r.id !== id));
};


const sortTasksByTime = (taskList) =>
  [...taskList].sort(
    (a, b) =>
      timeToMinutesSafe(a.time) - timeToMinutesSafe(b.time)
  );

const getUpcomingTasks = () => {
  const now = new Date();

  return tasks
    .filter(task => !task.isDeadline && !task.isCompleted && task.time && task.date)
    .filter(task => {
      const taskDateTime = buildDateTime(task.date, task.time);
      return taskDateTime && taskDateTime >= now; // only future tasks
    })
    .sort((a, b) => {
      return buildDateTime(a.date, a.time) - buildDateTime(b.date, b.time);
    })
    .slice(0, 3); // first 3 upcoming
};

const getReminderTasks = () => {
  const now = new Date();

  return reminders
    .map(rem => {
      const task = tasks.find(t => t.id === rem.taskId);
      const reminderDateTime = buildDateTime(rem.reminderDate, rem.reminderTime);

      return {
        ...rem,
        task,
        reminderDateTime,
      };
    })
    .filter(r => r.task && r.reminderDateTime >= now)
    .sort((a, b) => a.reminderDateTime - b.reminderDateTime)
    .slice(0, 3);
};


const getWeeklyActualDistribution = () => {
  const weeklyTasks = getTasksForWeek(tasks);
  return getActualWeeklyDistribution(weeklyTasks);
};

const weekLabel = getWeekRangeLabel(new Date());

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const normalizedTasks = savedTasks.map(task => ({
    ...defaultTask,
    ...task,
    }));
    setTasks(normalizedTasks);

    const savedRems  = JSON.parse(localStorage.getItem("reminders")) || [];
    setReminders(
  savedRems?.length ? savedRems : []
);

    const savedPrefs = JSON.parse(localStorage.getItem("schedulePreferences"));

    setSchedulePreferences(
      savedPrefs?.length ? savedPrefs : DEFAULT_PREFERENCES
    );

    const savedDead = JSON.parse(localStorage.getItem("deadlines")) || [];
    setDeadlines(savedDead);

    const savedDist = JSON.parse(localStorage.getItem("timeDistribution"));
    setTimeDistribution(
    savedDist?.length ? savedDist : DEFAULT_DISTRIBUTION
);
  }, []);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("timeDistribution", JSON.stringify(timeDistribution));
  }, [timeDistribution]);

  useEffect(() => {
  localStorage.setItem(
    "schedulePreferences",
    JSON.stringify(schedulePreferences)
  );
}, [schedulePreferences]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        defaultTask,
        addTask,
        deleteTask,
        updateTask,

        getUpcomingTasks,
        getReminderTasks,
        getWeeklyActualDistribution,
        weekLabel,

        deadlines,
        setDeadlines,
        timeDistribution,
        setTimeDistribution,
        reminders,
        setReminders,
        defaultReminder,
        addReminder,
        updateReminder,
        deleteReminder,
        schedulePreferences,
        setSchedulePreferences,
        generatedSchedule,
        setGeneratedSchedule,
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