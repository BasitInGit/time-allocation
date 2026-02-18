import { useState } from "react";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Hardcoded schedule using your tasks
  const schedules = [
    {
      id: 1,
      title: "CS Lecture",
      time: "10:00",
      duration: 2, // hours
      color: "bg-indigo-500",
    },
    {
      id: 2,
      title: "Gym Session",
      time: "15:00",
      duration: 1,
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Family Dinner",
      time: "19:00",
      duration: 2,
      color: "bg-yellow-500",
    },
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventForHour = (hour) => {
    return schedules.find((event) => {
      const eventHour = parseInt(event.time.split(":")[0]);
      return hour === eventHour;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
            <h2 className="text-2xl font-semibold mb-2">Calendar</h2>

            {/* Date Selector */}
            <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg p-2 shadow-sm"
            />
        </div>

        <button className="text-gray-600 hover:text-gray-800 text-2xl transition-colors">
            ⚙
        </button>
        
      </div>
      {/* Scrollable Timeline */}
      <div className="h-[70vh] overflow-y-auto bg-white rounded-xl shadow p-4">
        {hours.map((hour) => {
          const event = getEventForHour(hour);

          return (
            <div
              key={hour}
              className="relative border-b border-gray-200 h-20 flex items-start"
            >
              {/* Time Label */}
              <div className="w-20 text-sm text-gray-500">
                {hour.toString().padStart(2, "0")}:00
              </div>

              {/* Event Block */}
              <div className="flex-1 relative">
                {event && (
                  <div
                    className={`${event.color} text-white rounded-lg px-3 py-2 absolute w-full`}
                    style={{
                      height: `${event.duration * 80}px`,
                    }}
                  >
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm opacity-90">
                      {event.time} ({event.duration}h)
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
