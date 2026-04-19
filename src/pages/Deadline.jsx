import { useState, useRef,useMemo  } from "react";
import { useAppContext } from "../context/AppContext";
import { normalizeDate, getLocalDateStr, buildDateTime } from "../utils/dateUtils";
import { normalizeTime } from "../utils/Scheduler/timeUtils";

const CATEGORIES = [
  "Academic",
  "Health",
  "Leisure",
  "Work",
];

function Deadlines() {
  const { deadlines, setDeadlines } = useAppContext();

  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [recentlySavedId, setRecentlySavedId] = useState(null);

  const deadlineRefs = useRef({});

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    category: "Academic",
    duration: 1, 
  });

  // ================= SELECT =================
  const selectDeadline = (d) => {
    setSelectedDeadline(d);

    setForm({
      title: d.title,
      date: d.date,
      time: normalizeTime(d.time),
      category: d.category || "Academic",
      duration: Number(d.duration) || 1,
    });
  };

  // ================= SAVE =================
  const handleSave = () => {
  if (!form.title || !form.date) return;

  const updatedItem = {
    ...form,
    time: form.time ? normalizeTime(form.time) : "",
    duration: Math.max(0.5, Number(form.duration) || 1)
  };

  let updated;

  if (selectedDeadline) {
    updated = deadlines.map((d) =>
      d.id === selectedDeadline.id
        ? { ...d, ...updatedItem }
        : d
    );

    setRecentlySavedId(selectedDeadline.id);
  } else {
    const newDeadline = {
      id: crypto.randomUUID(),
      ...updatedItem,
    };

    updated = [...(deadlines || []), newDeadline];
    setRecentlySavedId(newDeadline.id);
  }

  setDeadlines(updated);

  setTimeout(() => setRecentlySavedId(null), 1500);

  setSelectedDeadline(null);

  setForm({
    title: "",
    date: "",
    time: "",
    category: "Academic",
    duration: 1,
  });
};

  // ================= DELETE =================
  const handleDelete = (d) => {
    const updated = deadlines.filter((x) => x.id !== d.id);
    setDeadlines(updated);

    if (selectedDeadline?.id === d.id) {
      setSelectedDeadline(null);
    }
  };

  // ================= GROUPING =================
const isOverdue = (d) => {
  const now = new Date();
  const due = buildDateTime(d.date, d.time);
  return due ? due < now : normalizeDate(d.date) < normalizeDate(now);
};

  const overdueSet = useMemo(
  () => new Set(deadlines.filter(isOverdue).map(d => d.id)),
  [deadlines]
);

const { overdue, upcoming } = useMemo(() => {
  const overdue = [];
  const upcoming = [];

  for (const d of deadlines) {
    (isOverdue(d) ? overdue : upcoming).push(d);
  }

  return { overdue, upcoming };
}, [deadlines]);

  // ================= SECTION =================
  const DeadlineSection = ({ title, items, color, filter }) => {
    const filteredItems = filter ? items.filter(filter) : items;
    if (!filteredItems.length) return null;

    return (
      <div className="mb-4">
        <p className={`text-sm font-semibold mb-2 ${color}`}>
          {title}
        </p>

        {filteredItems.map((d) => (
          
          <div
            key={d.id}
            ref={(el) => (deadlineRefs.current[d.id] = el)}
            className={`p-3 rounded mb-2 border transition ${
              
              recentlySavedId === d.id
                ? "bg-green-100 border-green-400"
                : overdueSet.has(d.id)
                ? "bg-red-50 border-red-300"
                : "hover:bg-gray-100"
            }`}
          >
            <p className="font-medium">{d.title}</p>

            <p className="text-xs text-gray-500">
              📅 {d.date}
            </p>

            <p className="text-xs text-gray-500">
              🏷 {d.category} • ⏱ {d.duration}h
            </p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => selectDeadline(d)}
                className="text-sm text-indigo-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(d)}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ================= UI =================
  return (
    <div className="flex h-full bg-white rounded-xl shadow overflow-hidden">

      {/* LEFT */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <p className="font-semibold mb-3">Deadlines</p>

        <DeadlineSection
          title="🔴 Overdue"
          items={overdue}
          color="text-red-600"
        />

        <DeadlineSection
          title="⏭ Upcoming"
          items={upcoming}
          color="text-gray-600"
        />
      </div>

      {/* RIGHT */}
      <div className="flex-1 p-6 max-w-md">

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4">
            {selectedDeadline ? "Edit Deadline" : "Add New Deadline"}
        </h2>

        {/* TITLE */}
        <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
            Title
            </label>
            <input
            type="text"
            placeholder="Enter deadline title"
            value={form.title}
            onChange={(e) =>
                setForm({ ...form, title: e.target.value })
            }
            className="w-full border p-2 rounded"
            />
        </div>

        {/* DATE */}
        <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
            Due Date
            </label>
            <input
            type="date"
            value={normalizeDate(form.date)}
            onChange={(e) =>
                setForm({ ...form, date: e.target.value })
            }
            className="w-full border p-2 rounded"
            />
        </div>

        {/* TIME */}
<div className="mb-4">
  <label className="block text-sm text-gray-600 mb-1">
    Due Time (optional)
  </label>

  <input
    type="time"
    value={form.time}
    onChange={(e) =>
      setForm({ ...form, time: e.target.value })
    }
    className="w-full border p-2 rounded"
  />
</div>

        {/* CATEGORY */}
        <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
            Category
            </label>
            <select
            value={form.category}
            onChange={(e) =>
                setForm({ ...form, category: e.target.value })
            }
            className="w-full border p-2 rounded"
            >
            {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                {c}
                </option>
            ))}
            </select>
        </div>

        {/* DURATION (UPDATED TO HOURS) */}
        <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
            Estimated Time (hours)
            </label>
            <input
            type="number"
            min="0.5"
            step="0.5"
            value={form.duration}
            onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
            placeholder="e.g. 2.5"
            />
        </div>

        {/* SAVE BUTTON */}
        <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
            {selectedDeadline ? "Update Deadline" : "Add Deadline"}
        </button>

        </div>
    </div>
  );
}

export default Deadlines;