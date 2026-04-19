import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { normalizeDate, buildDateTime } from "../utils/dateUtils";
import { normalizeTime } from "../utils/Scheduler/timeUtils";

function Reminders() {
  const { tasks, reminders, addReminder, updateReminder, deleteReminder } = useAppContext();
  const { taskId } = useParams();
  const taskRefs = useRef({});

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  // Form state
  const [form, setForm] = useState({
    reminder: true,
    reminderDate: "",
    reminderTime: "",
    frequency: "once",
  });

  useEffect(() => {
    if (taskId) {
      const found = tasks.find(t => t.id === taskId);
      if (found) {
        selectTask(found);
      }
    }
  }, [taskId]); 

const selectTask = (task) => {
  if (!task) return;

  setSelectedTask(task);
  setSelectedDate(task.date || "");

  const existing = reminders.find(r => r.taskId === task.id);

  setForm({
    reminderDate: existing?.reminderDate ?? "",
    reminderTime: existing?.reminderTime ?? "",
    frequency: existing?.frequency ?? "once",
  });
};

  const [recentlySavedId, setRecentlySavedId] = useState(null);

const handleSave = () => {
  if (!selectedTask) return;

  const existing = reminders.find(r => r.taskId === selectedTask.id);

  const newReminder = {
    id: existing?.id || crypto.randomUUID(),
    taskId: selectedTask.id,
    reminderDate: normalizeDate(form.reminderDate),
    reminderTime: normalizeTime(form.reminderTime),
    frequency: form.frequency,
  };

  if (existing) {
    updateReminder(newReminder);
  } else {
    addReminder(newReminder);
  }

  setRecentlySavedId(selectedTask.id);

  setTimeout(() => {
    taskRefs.current[selectedTask.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);

  setTimeout(() => setRecentlySavedId(null), 1500);

  setSelectedTask(null);
  setSelectedDate("");
  setForm({
    reminderDate: "",
    reminderTime: "",
    frequency: "once",
  });
};

const handleDeleteReminder = (task) => {
  const reminder = reminders.find(r => r.taskId === task.id);
  if (!reminder) return;

  deleteReminder(reminder.id);

  if (selectedTask?.id === task.id) {
    setSelectedTask(null);
    setForm({
      reminderDate: "",
      reminderTime: "",
      frequency: "once",
    });
  }
};
 

const isOverdue = (r) => {
  const now = new Date();
  const due = buildDateTime(r.reminderDate, r.reminderTime);
  return due ? due < now : false;
};

  const isToday = (task) => {
    const taskDate = new Date(task.reminderDate);
    const today = new Date();

    return (
        taskDate.getFullYear() === today.getFullYear() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getDate() === today.getDate()
    );
  };


  const overdueReminders = reminders.filter(isOverdue);
  const todayReminders = reminders.filter(
    t => !isOverdue(t) && isToday(t)
  );
  const upcomingReminders = reminders.filter(
    t => !isOverdue(t) && !isToday(t)
  );

  const filteredTasks = selectedTask
  ? []
  : tasks.filter(
      t =>
        normalizeDate(t.date) === normalizeDate(selectedDate) &&
        (!t.reminder || t.id === selectedTask?.id)
    );

  const ReminderSection = ({ title, items, color }) => {
    if (!items.length) return null;

    return (
        <div className="mb-4">
        <p className={`text-sm font-semibold mb-2 ${color}`}>
            {title}
        </p>

        {items.map(task => {
            const overdue = isOverdue(task);

            return (
            <div
                key={task.id}
                ref={(el) => (taskRefs.current[task.id] = el)}
                className={`p-3 rounded mb-2 border transition-all duration-300 ${
                recentlySavedId === task.id
                    ? "bg-green-100 border-green-400 scale-[1.02]"
                    : overdue
                    ? "bg-red-50 border-red-300"
                    : "hover:bg-gray-100"
                }`}
            >
                <p className="font-medium">{task.title}</p>

                <p className="text-xs text-gray-500 mb-1">
                ⏰ {task.reminderDate} {task.reminderTime}
                </p>

                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {task.frequency}
                </span>

                <div className="flex gap-3 mt-2">
                <button
                    onClick={() => {
                      const fullTask = tasks.find(t => t.id === task.taskId || t.id === task.id);
                      selectTask(fullTask || task);
                    }}
                    className="text-sm text-indigo-600"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDeleteReminder(task)}
                    className="text-sm text-red-500"
                >
                    Delete
                </button>
                </div>
            </div>
            );
        })}
        </div>
    );
  };
  
  return (
  <div className="flex h-full bg-white rounded-xl shadow overflow-hidden">

    {/* ================= LEFT PANEL ================= */}
    <div className="w-1/3 border-r p-4 overflow-y-auto">

      <p className="font-semibold mb-3">Reminders</p>

      <ReminderSection
        title="🔴 Overdue"
        items={overdueReminders}
        color="text-red-600"
      />

      <ReminderSection
        title="📅 Today"
        items={todayReminders}
        color="text-blue-600"
      />

      <ReminderSection
        title="⏭ Upcoming"
        items={upcomingReminders}
        color="text-gray-600"
      />

    </div>

    {/* ================= RIGHT PANEL ================= */}
    <div className="flex-1 p-6">

      <h2 className="text-xl font-semibold mb-4">
        Reminder Editor
      </h2>

      {/* 🔹 Step 1: Date Picker */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setSelectedTask(null);
        }}
        className="w-full border p-2 rounded mb-4"
      />

      {/* 🔹 Empty state: no date */}
      {!selectedDate && (
        <p className="text-gray-400 text-sm mt-4">
          Select a date to begin
        </p>
      )}

      {/* 🔹 Step 2: Task Selection (ONLY if date selected & no task yet) */}
      {selectedDate && !selectedTask && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select Task
          </p>

          {filteredTasks.length === 0 && (
            <p className="text-gray-400 text-sm">
              No tasks for this date
            </p>
          )}

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filteredTasks.map(task => (
              <button
                key={task.id}
                onClick={() => selectTask(task)}
                className="w-full text-left p-3 rounded bg-gray-100 hover:bg-gray-200"
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.time}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Step 3: Selected Task Display */}
      {selectedTask && (
        <div className="mb-4 p-3 bg-indigo-50 rounded border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Selected Task:
              </p>
              <p className="font-medium">
                {selectedTask.title}
              </p>
            </div>

            {/* 🔄 Change task button */}
            <button
              onClick={() => setSelectedTask(null)}
              className="text-sm text-indigo-600"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Step 4: Reminder Form */}
      {selectedTask && (
      <>
        {/* 🔹 Reminder Date */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Reminder Date
          </label>
          <input
            type="date"
            value={form.reminderDate}
            onChange={(e) =>
              setForm({ ...form, reminderDate: e.target.value })
            }
            className={`w-full border p-2 rounded transition
            ${!form.reminderDate ? "text-gray-400 blur-[0.2px]" : ""}`}
          />
        </div>

        {/* 🔹 Reminder Time */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Reminder Time
          </label>
          <input
            type="time"
            value={form.reminderTime}
            onChange={(e) =>
              setForm({ ...form, reminderTime: e.target.value })
            }
            className={`w-full border p-2 rounded transition
            ${!form.reminderTime ? "text-gray-400 blur-[0.2px]" : ""}`}
          />
        </div>

        {/* 🔹 Frequency */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Frequency
          </label>
          <select
            value={form.frequency}
            onChange={(e) =>
              setForm({ ...form, frequency: e.target.value })
            }
            className="w-full border p-2 rounded text-gray-700"
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* 🔹 Save Button */}
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Save Reminder
        </button>
      </>
      )}
    </div>
  </div>
);
};

export default Reminders;