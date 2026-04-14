import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showAbove, setShowAbove] = useState(false);
  const [showBelow, setShowBelow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  

  const { tasks, defaultTask, addTask, updateTask, deleteTask: deleteGlobalTask } = useAppContext();
  
  const [newTask, setNewTask] =  useState(defaultTask);

  const categoryColors = {
  Academic: "bg-indigo-500",
  Health: "bg-green-500",
  Leisure: "bg-yellow-500",
  Family: "bg-pink-500",
  "Personal Dev": "bg-purple-500",
  };

  const [selectedTask, setSelectedTask] = useState(null);

  const openCreateModal = () => {
    setNewTask({ ...defaultTask, date: selectedDate });
    setShowModal(true);
  };

  const saveTask = () => {
    const color = categoryColors[newTask.category] || "bg-gray-500";

    const taskData = {
      ...defaultTask,
      ...newTask,
      color, 
    };

    if (newTask.id) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }

    setNewTask(defaultTask);
    setShowModal(false);
  };
  
  const getEventTop = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 80 + (minutes / 60) * 80; // 80px per hour
  };

  const getEndTime = (startTime, duration) => {
    if (!startTime || !duration) return "";

    const [hours, minutes] = startTime.split(":").map(Number);

    const start = new Date();
    start.setHours(hours, minutes, 0);

    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const endHours = end.getHours().toString().padStart(2, "0");
    const endMinutes = end.getMinutes().toString().padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  const getEventHeight = (duration) => duration * 80; // 1hr = 80px, 0.5hr = 40px

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const currentHour = new Date().getHours();
    const scrollAmount = currentHour * 80;
    el.scrollTop = scrollAmount - 100;

    checkVisibleEvents();
  }, []);

  useEffect(() => {
    checkVisibleEvents();
  }, [tasks, selectedDate]);

  const visibleEvents = tasks.filter(e => e.date === selectedDate);

  const checkVisibleEvents = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const visibleStartHour = Math.floor(scrollTop / 80);
    const visibleEndHour = Math.floor((scrollTop + el.clientHeight) / 80);

    const eventHours = tasks
      .filter((e) => e.date === selectedDate)
      .map((e) => parseInt(e.time.split(":")[0]));

    setShowAbove(eventHours.some(h => h < visibleStartHour));
    setShowBelow(eventHours.some(h => h > visibleEndHour));
  };

  const computeEventLayout = (events) => {
    const sorted = [...events].sort(
      (a, b) => getEventTop(a.time) - getEventTop(b.time)
    );

    const layout = [];

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      let col = 0;

      while (
        layout.some(
          (e) =>
            e.column === col &&
            getEventTop(e.time) + getEventHeight(e.duration) >
              getEventTop(current.time) &&
            getEventTop(current.time) + getEventHeight(current.duration) >
              getEventTop(e.time)
        )
      ) {
        col++;
      }

      layout.push({
        ...current,
        column: col,
      });
    }
    return layout.map((event) => {
      const overlapping = layout.filter(
        (e) =>
          getEventTop(e.time) < getEventTop(event.time) + getEventHeight(event.duration) &&
          getEventTop(event.time) < getEventTop(e.time) + getEventHeight(e.duration)
      );
      const totalColumns = Math.max(...overlapping.map((e) => e.column)) + 1;
      return { ...event, totalColumns };
    });
  };

  const handleDeleteTask = (taskId) => {
    deleteGlobalTask(taskId);
    setSelectedTask(null);
  };

  const editTask = (task) => {
    setNewTask(task);
    setSelectedTask(null);
    setShowModal(true);
  };

  const isTaskValid = newTask.date && newTask.time && newTask.duration;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Calendar</h2>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-2 py-1 shadow-sm"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Create Task
        </button>

      </div>

      <div className="relative">

        {/* Scrollable calendar */}
        <div
          ref={scrollRef} 
          className="h-[70vh] overflow-y-auto relative bg-white rounded-xl shadow"
          onScroll={checkVisibleEvents}
        >
          <div className="relative" style={{ height: `${24 * 80}px` }}>
            {/* Hour rows */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex border-b border-gray-200 h-20 items-start">
                <div className="w-20 text-sm text-gray-500">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex-1 relative" />
              </div>
            ))}

            {/* Events */}
            {computeEventLayout(tasks.filter(t => t.date === selectedDate)).map((event) => {
              const isPast = new Date(`${event.date}T${event.time}`) < new Date();
              const width = 100 / event.totalColumns;
              const left = (event.column * 100) / event.totalColumns;

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedTask(event)}
                  className={`${event.color} text-white rounded-lg px-3 py-2 absolute cursor-pointer overflow-hidden`}
                  style={{
                    top: `${getEventTop(event.time)}px`,
                    height: `${getEventHeight(event.duration)}px`,
                    width: `${width}%`,
                    left: `${left}%`,
                  }}
                >
                  {isPast && (
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500 transform -translate-y-1/2 pointer-events-none" />
                  )}
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs opacity-90">
                    {event.time} – {getEndTime(event.time, event.duration)}
                  </p>

                  <div className="mt-1 text-xs">
                  {event.reminder ? (
                    <span className="text-green-200 font-medium">
                      🔔 Reminder set
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reminderPage/${event.id}`);
                      }}
                      className="text-white underline opacity-90 hover:opacity-100"
                    >
                      + Add reminder
                    </button>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      
      {/* Indicators */}
        {showAbove && (
          <div className="absolute top-3 right-4 bg-gray-900 text-white text-xs px-3 py-1 rounded-full shadow">
            ↑ Events above
          </div>
        )}

        {showBelow && (
          <div className="absolute bottom-3 right-4 bg-gray-900 text-white text-xs px-3 py-1 rounded-full shadow">
            ↓ Events below
          </div>
        )}
      </div>

      {showModal && (
      <div className="absolute inset-0 bg-black/20 bg-opacity-30 flex items-center justify-center z-40">
        <div className="bg-white rounded-xl p-6 w-96 shadow-lg">

          <h3 className="text-lg font-semibold mb-4">Create Task</h3>

          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
            className="w-full border p-2 rounded mb-3"
          />

          <select
            value={newTask.category}
            onChange={(e) =>
              setNewTask({ ...newTask, category: e.target.value })
            }
            className="w-full border p-2 rounded mb-3"
          >
            {Object.keys(categoryColors).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            value={newTask.date || selectedDate}
            min={new Date().toISOString().split("T")[0]} // disable past dates
            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
            className="w-full border p-2 rounded mb-3"
          />

          <select
            value={newTask.time}
            onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">Select time</option>

            {Array.from({ length: 24 }, (_, hour) =>
              [0, 15, 30, 45].map((minute) => {
                const time = `${hour.toString().padStart(2, "0")}:${minute
                  .toString()
                  .padStart(2, "0")}`;

                return (
                  <option key={time} value={time}>
                    {time}
                  </option>
                );
              })
            )}
          </select>

          <input
            type="number"
            min="0.5"
            step="0.5"
            placeholder="Duration (hours)"
            value={newTask.duration}
            onChange={(e) =>
              setNewTask({ ...newTask, duration: Number(e.target.value) })
            }
            className="w-full border p-2 rounded mb-3"
          />

          <textarea
            placeholder="Details"
            value={newTask.details}
            onChange={(e) =>
              setNewTask({ ...newTask, details: e.target.value })
            }
            className="w-full border p-2 rounded mb-3"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={saveTask}
              className={`px-4 py-2 rounded ${isTaskValid ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              disabled={!isTaskValid}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      )}

      {selectedTask && (
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-96 overflow-hidden">
          <div className={`h-2 w-full ${selectedTask.color}`} />
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Task Details</h3>

            <p className="mb-2"><strong>Title:</strong> {selectedTask.title}</p>
            <p className="mb-2"><strong>Category:</strong> {selectedTask.category}</p>
            <p className="mb-2"><strong>Time:</strong> {selectedTask.time}</p>
            <p className="mb-2"><strong>Duration:</strong> {selectedTask.duration} hour(s)</p>

            {selectedTask.details && (
              <p className="mb-2"><strong>Details:</strong> {selectedTask.details}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => editTask(selectedTask)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Delete
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-gray-600"
              >
                Close
              </button>
          </div>
          </div>
          </div>
      </div>
    )}
    </div>
  );
}

export default Calendar;
