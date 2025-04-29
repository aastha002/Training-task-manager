import { useState, useEffect } from "react";
import CalendarView from "../Components/CalendarView";
import TaskDetails from "../Components/TaskDetails";

function TraineeDashboard() {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      return storedTasks ? JSON.parse(storedTasks) : {};
    } catch (e) {
      console.error("Error reading tasks from localStorage", e);
      return {};
    }
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateTask = (date, taskId, updatedFields) => {
    const formattedDate = date.toDateString();
    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[formattedDate]?.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      );
      const newTasks = {
        ...prevTasks,
        [formattedDate]: updatedTasksForDate || [],
      };
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const completeTask = (date, taskId, traineeDescription, traineeLink) => {
    const formattedDate = date.toDateString();
    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[formattedDate]?.map((task) =>
        task.id === taskId
          ? { ...task, traineeDescription, traineeLink, completed: true }
          : task
      );
      const newTasks = {
        ...prevTasks,
        [formattedDate]: updatedTasksForDate || [],
      };
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const deleteTask = (date, taskId) => {
    const formattedDate = date.toDateString();
    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[formattedDate]?.filter(
        (task) => task.id !== taskId
      );
      const newTasks = { ...prevTasks };
      if (updatedTasksForDate?.length > 0) {
        newTasks[formattedDate] = updatedTasksForDate;
      } else {
        delete newTasks[formattedDate];
      }
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const formattedSelectedDate = selectedDate.toDateString();
  const tasksForSelectedDate = tasks[formattedSelectedDate] || [];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-pink-700 mb-8">
        Trainee Dashboard
      </h1>

      {/* Calendar Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <CalendarView tasks={tasks} onDateChange={setSelectedDate} />
      </div>

      {/* Task Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-pink-600 text-center">
          Tasks for {formattedSelectedDate}
        </h2>

        {tasksForSelectedDate.length > 0 ? (
          <div className="space-y-6">
            {tasksForSelectedDate.map((task) => (
              <TaskDetails
                key={task.id}
                task={task}
                date={selectedDate}
                isManager={false}
                onUpdate={(date, updatedFields) =>
                  updateTask(date, task.id, updatedFields)
                }
                onComplete={(date, traineeDescription, traineeLink) =>
                  completeTask(date, task.id, traineeDescription, traineeLink)
                }
                onDelete={(date) => deleteTask(date, task.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No tasks assigned for this day.
          </p>
        )}
      </div>
    </div>
  );
}

export default TraineeDashboard;
