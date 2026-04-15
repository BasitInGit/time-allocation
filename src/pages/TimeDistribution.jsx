import { useState, useRef, useEffect } from "react"
import { useAppContext } from "../context/AppContext";
import { PieChart, Pie, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const AVAILABLE_CATEGORIES = [
  "Academic",
  "Health",
  "Leisure",
  "Family",
  "Personal Dev",
  "Social",
  "Work",
]

const CATEGORY_COLORS = {
  Academic: "#6366F1",
  Health: "#10B981",
  Leisure: "#F59E0B",
  Family: "#EF4444",
  "Personal Dev": "#8B5CF6",
  Social: "#EC4899",
  Work: "#14B8A6",
};

export default function TimeDistribution() {
  
  const [isEditing, setIsEditing] = useState(false)

  const { timeDistribution, setTimeDistribution, getWeeklyActualDistribution, weekLabel } = useAppContext();
  
  const [categories, setCategories] = useState(
  timeDistribution.length > 0
    ? timeDistribution
    : [{ name: "Academic", value: 100, fill: "#6366F1" }]
);

const total = categories.reduce((sum, c) => sum + c.value, 0);
const isValidTotal = total === 100;

const target = categories;

const actualRaw = getWeeklyActualDistribution();
const actual = actualRaw?.length
  ? actualRaw
  : [];
const hasActual = actual.length > 0;

const addCategory = (name) => {
  if (categories.find((c) => c.name === name)) return;

  setCategories([
    ...categories,
    {
      name,
      value: 0,
      fill: CATEGORY_COLORS[name] || "#9CA3AF",
    },
  ]);
};

  const removeCategory = (name) => {
    const filtered = categories.filter((c) => c.name !== name);
    if (filtered.length === 0) return;
    setCategories(filtered);
  };

  const updateValue = (index, value) => {
    const updated = [...categories];
    updated[index] = {
      ...updated[index],
      value: Number(value),
    };
    setCategories(updated);
  };

  const reset = () => {
    setCategories([{ name: "Academic", value: 100, fill: "#6366F1" }])
  }

  const handleSave = () => {
    if (!isValidTotal) return;
    setTimeDistribution(categories);
    setIsEditing(false);
  };

  const targetWithColors = target.map((entry) => ({
  ...entry,
  fill: CATEGORY_COLORS[entry.name] || "#9CA3AF",
}));

const actualWithColors = actual.map((entry) => ({
  ...entry,
  fill: CATEGORY_COLORS[entry.name] || "#9CA3AF",
}));
  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <h1 className="text-xl font-bold mb-6">Weekly Time Distribution</h1>
      <p className="text-sm text-gray-500 mb-6">
        Week of {weekLabel}
      </p>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* TARGET */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Target Distribution</h2>
          
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={targetWithColors}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {target.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.name] }}
                />
                <span className="text-sm text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actual */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Actual Distribution</h2>

          {actual.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400">
              No tasks logged this week
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actualWithColors}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {actual.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.name] }}
                />
                <span className="text-sm text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TARGET vs ACTUAL COMPARISON */}
      <div className={`bg-white p-4 rounded-xl shadow mb-6 ${hasActual ? "" : "opacity-50"}`}>

        <h2 className="font-semibold mb-4">
          Target vs Actual (Comparison)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={target.map(t => ({
              name: t.name,
              target: t.value,
              actual: actual.find(a => a.name === t.name)?.value || 0
            }))}
          >

            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="target" fill="#6366F1" />
            <Bar dataKey="actual" fill="#10B981" />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TARGET EDITING PANEL */}
      <div className="bg-white p-4 rounded-xl shadow mt-6">

        <h2 className="font-semibold mb-4">
          Edit Target Distribution
        </h2>

        {categories.map((cat, index) => (
          <div key={index} className="mb-3 border p-3 rounded">

            <div className="flex justify-between">
              <span>{cat.name}</span>

              {isEditing && (
                <button
                  onClick={() => removeCategory(cat.name)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            {/* SLIDER */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={cat.value}
              disabled={!isEditing}
              onChange={(e) => updateValue(index, e.target.value)}
              className="w-full"
            />

            {isEditing && (
              <>
                <input
                  type="number"
                  value={cat.value}
                  onChange={(e) => updateValue(index, e.target.value)}
                  className="w-full border mt-1 p-1"
                />
              </>
            )}

            {!isEditing && (
              <p className="text-sm text-gray-500">
                {cat.value}%
              </p>
            )}

          </div>
        ))}
      </div>

      {/* ================= ADD CATEGORY ================= */}
      {isEditing && (
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-2">
          {AVAILABLE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => addCategory(cat)}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              + {cat}
            </button>
          ))}
        </div>
      )}

      {/* ================= CONTROLS ================= */}
      <div className="flex gap-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 bg-indigo-600 text-white p-2 rounded-xl"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={!isValidTotal}
              className={`flex-1 p-2 rounded-xl text-white ${
                isValidTotal
                  ? "bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>

            <button
              onClick={reset}
              className="flex-1 bg-gray-300 p-2 rounded-xl"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}