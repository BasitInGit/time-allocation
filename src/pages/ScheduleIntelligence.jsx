import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateSchedule } from "../utils/Scheduler/schedulerEngine";
import { useAppContext } from "../context/AppContext";
import { analyzeDeadlineLoadByCategory } from "../utils/deadlineAnalyser";
import { getLocalDateStr, normalizeDate } from "../utils/dateUtils";
import {toMinutes} from "../utils/Scheduler/timeUtils";
import { getActualWeeklyDistribution2 } from "../utils/analytics";

const INTENSITY_OPTIONS = ["Light", "Balanced", "Intense"];

const DEFAULT_PREFS = [
  { name: "Academic", preferredTime: "any", intensity: "medium" },
  { name: "Work", preferredTime: "any", intensity: "medium" },
  { name: "Health", preferredTime: "any", intensity: "medium" },
  { name: "Leisure", preferredTime: "any", intensity: "medium" },
];

const categoryColors = {
  Academic: "bg-indigo-500",
  Health: "bg-green-500",
  Leisure: "bg-yellow-500",
  Work: "bg-purple-500",
  };
export default function Generate() {
  const navigate = useNavigate();

  const {
    tasks,
    setTasks,
    deadlines,
    timeDistribution,
    schedulePreferences,
    setSchedulePreferences,
    generatedSchedule,
    setGeneratedSchedule,
  } = useAppContext();

  const HOURS = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  // ================= STATE =================
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [useTargetDistribution, setUseTargetDistribution] = useState(false);
  const [draftPreferences, setDraftPreferences] = useState([]);

  useEffect(() => {
  if (schedulePreferences?.length) {
    setDraftPreferences(schedulePreferences);
  } else {
    setDraftPreferences(DEFAULT_PREFS);
  }
}, [schedulePreferences]);

const analysisByCategory = selectedDate
  ? analyzeDeadlineLoadByCategory(deadlines, selectedDate)
  : {};

const updatePreference = (index, field, value) => {
  const updated = [...draftPreferences];
  updated[index] = {
  ...updated[index],
  [field]: value || "medium",
};
  setDraftPreferences(updated);
};

const canSave = selectedDate && draftPreferences.length > 0;

const handleSavePreferences = () => {
  setSchedulePreferences(draftPreferences);
};

const [useExisting, setUseExisting] = useState(true);

const [loading, setLoading] = useState(false);

  // ================= GENERATE =================
  const handleGenerate = () => {
    if (
      !selectedDate ||
      !startTime ||
      !endTime ||
      toMinutes(endTime) <= toMinutes(startTime)
    ) {
      alert("Please select valid date and time range");
      return;
    }

    setLoading(true);

    const existingTasks = useExisting
      ? tasks.filter(t =>normalizeDate(t.date) === normalizeDate(selectedDate))
      : [];

    let distribution = null;

    if (useTargetDistribution && selectedDate) {
      const actual = getActualWeeklyDistribution(tasks, selectedDate);

      distribution = timeDistribution.map(targetCat => {
        const actualMatch = actual.find(a => a.name === targetCat.name);

        return {
          category: targetCat.name,
          delta: (targetCat.value || 0) - (actualMatch?.value || 0),
        };
      });
    }
    const schedule = generateSchedule({
      date: selectedDate,
      startTime,
      endTime,
      deadlines,
      distribution,
      preferences: draftPreferences,
      categoryAnalysis: analysisByCategory,
      existingTasks,
    });

    const generatedTasks = schedule.map((t, i) => ({
      id: `gen-${i}-${t.date}-${t.start}`,
      title: t.name,
      category: t.category,
      date: t.date,
      time: toTimeStr(t.start),
      duration: t.duration,
      color: categoryColors[t.category] || "bg-gray-500",
      generated: true,
    }));
    
    setTasks((prev) => [
      ...prev.filter(t => !t.generated),
      ...generatedTasks
    ]);

    console.log("SCHEDULE OUTPUT:", schedule);
    console.log("ANALYSIS:", analysisByCategory);

    setLoading(false);
    navigate("/calendar");
  };

  // ================= UI =================
  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl">

        <h1 className="text-2xl font-bold mb-6">
          Generate Schedule
        </h1>

        {/* DATE + TIME WINDOW */}
        <div className="space-y-4 mb-8">
          
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a date for schedule
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`border p-2 rounded w-full ${!selectedDate ? "text-gray-400" : ""}`}
          />

          <div className="flex gap-3">
  
            {/* START TIME */}
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded w-full text-gray-700"
            >
              <option value="">Select start time</option>

              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            {/* END TIME */}
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded w-full text-gray-700"
            >
              <option value="">Select end time</option>

              {HOURS.filter(h => toMinutes(h) > toMinutes(startTime || "00:00")).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

          </div>
        </div>

      {!selectedDate && (
        <p className="text-sm text-gray-400 mb-3">
          Select a date to configure preferences
        </p>
      )}
        <h2 className="text-sm font-medium mb-3">
          Category Preferences
        </h2>

        {draftPreferences.map((cat, index) => {
          const analysis = analysisByCategory?.[cat.name] || {
            recommendedIntensity: "Light",
            warning: null,
            totalHours: 0,
          };

          return (
            <div key={cat.name} className="py-4 border-b border-gray-100">

              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-800">{cat.name}</p>
              </div>

              {/* TIME OF DAY */}
              <div className="space-y-2">
  
  {/* Time preference row */}
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">Time of day</span>

    <select
      value={cat.preferredTime || "any"}
      disabled={!selectedDate}
      onChange={(e) =>
        updatePreference(index, "preferredTime", e.target.value)
      }
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="morning">Morning</option>
      <option value="afternoon">Afternoon</option>
      <option value="evening">Evening</option>
      <option value="any">Any</option>
    </select>
  </div>

  {/* Intensity row */}
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">Intensity</span>

    <select
      value={cat.intensity || "medium"}
      disabled={!selectedDate}
      onChange={(e) =>
        updatePreference(index, "intensity", e.target.value)
      }
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>

</div>

              {/* RECOMMENDATION */}
              {analysis && (
                <p className="text-xs text-indigo-600 mt-2">
                  Recommended: {analysis.recommendedIntensity}
                </p>
              )}

              {/* WARNING */}
              {analysis?.warning && (
                <p className="text-xs text-red-500">
                  ⚠️ {analysis.warning}
                </p>
              )}

            </div>
          );
        })}

        <button
          onClick={handleSavePreferences}
          disabled={!canSave}
          className={`mb-6 px-4 py-2 rounded text-white ${
            canSave ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save Preferences
        </button>
        
        {/* EXISTING TASKS TOGGLE */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={useExisting}
            onChange={() => setUseExisting(!useExisting)}
          />
          <span className="text-sm text-gray-600">
            Use existing calendar tasks
          </span>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={useTargetDistribution}
            onChange={() => setUseTargetDistribution(!useTargetDistribution)}
          />
          <span className="text-sm text-gray-600">
            Aim for target distribution
          </span>
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {loading ? "Generating..." : "Generate Schedule"}
        </button>
      </div>
    </div>
  );
}