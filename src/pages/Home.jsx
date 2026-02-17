
function Home() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const upcomingTasks = [
    { id: 1, title: "CS Lecture", category: "Academic", color: "#4F46E5" },
    { id: 2, title: "Gym Session", category: "Health", color: "#10B981" },
    { id: 3, title: "Family Dinner", category: "Family", color: "#F59E0B" },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{today}</h2>
        <button className="text-gray-600 hover:text-gray-800 text-xl">⚙</button>
      </div>
      
      {/* Upcoming Tasks */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div key={task.id} className= "flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div
                className="w-3 h-3 rounded-full mr-4"
                style={{ backgroundColor: task.color }}
              ></div>
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">{task.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Add Task</button>
          <button className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">Generate Schedule</button>
          <button className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors">View Calendar</button>
        </div>
      </div>
    </div>
    
  )
}

export default Home