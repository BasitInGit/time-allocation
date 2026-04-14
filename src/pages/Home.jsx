import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Home() {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const { getUpcomingTasks, getReminderTasks } = useAppContext();

  const upcomingTasks = getUpcomingTasks();
  const reminders = getReminderTasks();

  return (
    <div className="flex-1 p-6 overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{today}</h2>

        <button
          onClick={() => navigate("/calendar")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Task
        </button>
      </div>

      {/* Upcoming Tasks */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Upcoming Tasks</h3>

        <div className="space-y-3">
          {upcomingTasks.length === 0 && (
            <p className="text-sm text-gray-400">No upcoming tasks</p>
          )}

          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm"
            >
              {/* subtle color indicator */}
              <div className={`w-2 h-10 rounded mr-4 ${task.color}`}></div>

              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">{task.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Reminders</h3>

        <div className="space-y-3">
          {reminders.length === 0 && (
            <p className="text-sm text-gray-400">No reminders set</p>
          )}

          {reminders.map((task) => (
            <div
              key={task.id}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm"
            >
              {/* subtle color indicator */}
              <div className={`w-2 h-10 rounded mr-4 ${task.color}`}></div>

              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">
                  ⏰ {task.reminderDate} {task.reminderTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;