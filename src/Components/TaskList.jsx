function TaskList({ tasks }) {
  const dates = Object.keys(tasks);

  if (dates.length === 0) {
    return (
      <p className="text-center text-pink-500 font-semibold mt-6">
        No tasks assigned yet.
      </p>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
        All Assigned Tasks
      </h2>

      <ul className="space-y-8">
        {dates.map((date) => {
          const task = tasks[date];
          return (
            <li
              key={date}
              className="p-6 border border-pink-100 rounded-lg hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-lg font-bold text-pink-700">
                  {new Date(date).toDateString()}
                </h3>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    task.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </span>
              </div>

              <div className="text-gray-700 mb-3">
                <span className="font-semibold">Task:</span> {task.title}
              </div>

              {task.description && (
                <div className="text-gray-600 mb-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {task.description}
                </div>
              )}

              {task.links && (
                <div className="text-blue-600 text-sm mb-2 break-words">
                  <span className="font-semibold">Related Links:</span>{" "}
                  {task.links.split(",").map((link, idx) => (
                    <a
                      key={idx}
                      href={link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-800 mr-2"
                    >
                      {link.trim()}
                    </a>
                  ))}
                </div>
              )}

              {task.completed && task.traineeDescription && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-700 font-semibold mb-1">
                    Trainee Response:
                  </p>
                  <p className="text-gray-700">{task.traineeDescription}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TaskList;
