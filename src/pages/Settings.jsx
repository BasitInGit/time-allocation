import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-6 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          ←
        </button>

        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">

        <button className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          Edit Profile
        </button>

        <button className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          Notification Preferences
        </button>

        <button className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          Time Distribution Goals
        </button>

        <button className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          Personalisation Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;