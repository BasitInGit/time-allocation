import { useState } from "react";

const categories = {
  Academic: ["Lecture", "Study", "Group Project", "Reading"],
  Health: ["Running", "Walking", "Cycling", "Yoga", "Weightlifting", "Basketball"],
  Family: ["Dinner", "Call family", "Visit"],
  Leisure: ["Gaming", "TV", "Music", "Hobbies"],
};

const timesOfDay = ["Morning", "Afternoon", "Evening"];

function PersonalizationPage({ onSave }) {
  const [selectedTasks, setSelectedTasks] = useState({});
  const [timePrefs, setTimePrefs] = useState({});

  const toggleTask = (category, task) => {
    setSelectedTasks((prev) => {
      const prevCategory = prev[category] || [];
      const newCategory = prevCategory.includes(task)
        ? prevCategory.filter((t) => t !== task)
        : [...prevCategory, task];
      return { ...prev, [category]: newCategory };
    });
  };

  const handleTimeChange = (category, value) => {
    setTimePrefs((prev) => ({ ...prev, [category]: value }));
  };

  const canSave = Object.entries(categories).every(
    ([cat]) => (selectedTasks[cat]?.length || 0) >= 3 && timePrefs[cat]
  );

  const handleSave = () => {
    if (!canSave) return;
    const result = {};
    Object.keys(categories).forEach((cat) => {
      result[cat] = {
        tasks: selectedTasks[cat],
        preferredTime: timePrefs[cat],
      };
    });
    onSave(result);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Personalize Your Schedule</h2>

      {/* Instruction */}
      <p className="text-gray-700 mb-4 font-medium text-left">
        Select at least 3 tasks per category:
      </p>

      {/* Task Selection Section */}
      {Object.entries(categories).map(([cat, tasks]) => (
        <div key={cat} className="mb-6">
          <h3 className="font-semibold text-lg mb-2">{cat}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tasks.map((task) => (
              <button
                key={task}
                type="button"
                onClick={() => toggleTask(cat, task)}
                className={`px-3 py-2 border rounded-lg transition
                  ${selectedTasks[cat]?.includes(task)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-800 border-gray-300"
                  }`}
              >
                {task}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Spacer */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Time of Day Section */}
      <p className="text-gray-700 mb-4 font-medium text-left">
        Select time of day for:
      </p>
      {Object.keys(categories).map((cat) => (
        <div key={cat} className="mb-4">
          <h4 className="font-medium mb-2">{cat}</h4>
          <div className="flex gap-2 flex-wrap">
            {timesOfDay.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeChange(cat, time)}
                className={`px-3 py-1 border rounded-lg transition
                  ${timePrefs[cat] === time
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-800 border-gray-300"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`mt-6 px-6 py-2 rounded-lg text-white font-medium transition
          ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Save Preferences
      </button>
    </div>
  );
}

export default PersonalizationPage;
