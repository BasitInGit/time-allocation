import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Hardcoded upcoming tasks
  const upcomingTasks = [
    { id: 1, title: "CS Lecture", category: "Academic", time: "10:00",
    details: "Lecture on algorithms", color: "#4F46E5" },
    { id: 2, title: "Gym Session", category: "Health", time: "15:00",
    details: "Upper body workout", color: "#10B981" },
    { id: 3, title: "Family Dinner", category: "Family", time: "19:00",
    details: "Dinner with family", color: "#F59E0B" },
  ];

  // Hardcoded deadline / reminders
  const deadlineTasks = [
    { id: 4, title: "Math Assignment", category: "Academic", time: "Due Tomorrow 23:59",
    details: "Complete calculus questions 1–10", color: "#6366F1" },
    { id: 5, title: "Evening Walk", category: "Health", time: "20:00",
    details: "30 minute walk around the park", color: "#34D399" },
    { id: 6, title: "Project Meeting", category: "Academic", time: "Friday 14:00",
    details: "Group discussion for software engineering project", color: "#818CF8" },
  ];

  const [deadlines, setDeadlines] = useState(deadlineTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{today}</h2>

        <button
          onClick={() => navigate("/settings")}
          className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ⚙
          </button>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="w-full text-left flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-3 h-3 rounded-full mr-4"
                style={{ backgroundColor: task.color }}
              ></div>
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">{task.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deadline / Reminder Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Reminders</h3>
        <div className="space-y-3">
          {deadlines.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="w-full text-left flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                  className="w-3 h-3 rounded-full mr-4"
                  style={{ backgroundColor: task.color }}
              ></div>
              <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.category}</p>
              </div>
            </button>
            ))}
        </div>
      </div>
      

      {/* Quick Actions Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/calendar")}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>

        <button
          onClick={() => navigate("/generate")}
          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Generate Schedule
        </button>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-6"
          onClick={() => setSelectedTask(null)} >

          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className="text-xl font-semibold mb-3">
              {selectedTask.title}
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Category:</strong> {selectedTask.category}</p>
              <p><strong>Time:</strong> {selectedTask.time}</p>
              <p><strong>Details:</strong> {selectedTask.details}</p>
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="mt-6 w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
