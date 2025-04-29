import { useState, useEffect } from "react";
import CalendarView from "../Components/CalendarView";
import TaskDetails from "../Components/TaskDetails";
import { v4 as uuidv4 } from "uuid";

function ManagerDashboard() {
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
  const [newTask, setNewTask] = useState({ title: "", description: "" });

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

  const completeTask = (date, taskId, managerFeedback) => {
    const formattedDate = date.toDateString();
    setTasks((prevTasks) => {
      const updatedTasksForDate = prevTasks[formattedDate]?.map((task) =>
        task.id === taskId
          ? { ...task, managerFeedback, completed: true }
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

  const addTask = (e) => {
    e.preventDefault();
    const formattedDate = selectedDate.toDateString();
    const newTaskEntry = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      managerFeedback: "",
    };
    setTasks((prevTasks) => {
      const updatedTasks = {
        ...prevTasks,
        [formattedDate]: [...(prevTasks[formattedDate] || []), newTaskEntry],
      };
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    setNewTask({ title: "", description: "" });
  };

  const formattedSelectedDate = selectedDate.toDateString();
  const tasksForSelectedDate = tasks[formattedSelectedDate] || [];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-pink-700 mb-8">
        Manager Dashboard
      </h1>

      {/* Calendar Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <CalendarView tasks={tasks} onDateChange={setSelectedDate} />
      </div>

      {/* Add Task Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-pink-600 text-center">
          Add Task for {formattedSelectedDate}
        </h2>
        <form onSubmit={addTask} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            required
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          ></textarea>
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Add Task
          </button>
        </form>
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
                isManager={true}
                onUpdate={(date, updatedFields) =>
                  updateTask(date, task.id, updatedFields)
                }
                onComplete={(date, managerFeedback) =>
                  completeTask(date, task.id, managerFeedback)
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

export default ManagerDashboard;
