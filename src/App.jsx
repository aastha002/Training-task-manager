import { useState } from "react";
import ManagerDashboard from "./Pages/ManagerDashboard";
import TraineeDashboard from "./Pages/TraineeDashboard";

function App() {
  const [role, setRole] = useState("");

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-pink-100">
        <h1 className="text-4xl font-bold text-pink-700">
          Training Task Manager
        </h1>
        <div className="flex gap-8">
          <button
            onClick={() => setRole("manager")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600"
          >
            Login as Manager
          </button>
          <button
            onClick={() => setRole("trainee")}
            className="bg-white border border-pink-500 text-pink-500 px-6 py-3 rounded-lg hover:bg-pink-100"
          >
            Login as Trainee
          </button>
        </div>
      </div>
    );
  }

  return role === "manager" ? <ManagerDashboard /> : <TraineeDashboard />;
}

export default App;
