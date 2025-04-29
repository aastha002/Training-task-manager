import React, { useState, useEffect } from "react";

function TaskDetails({
  task,
  date,
  isManager,
  onComplete = () => console.log("onComplete not provided"),
  onUpdate = () => console.log("onUpdate not provided"),
  onDelete = () => console.log("onDelete not provided"),
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [traineeDescription, setTraineeDescription] = useState("");
  const [traineeLink, setTraineeLink] = useState("");
  const [managerFeedback, setManagerFeedback] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [submissionMode, setSubmissionMode] = useState(false);
  const [error, setError] = useState("");

  const [savingTask, setSavingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [submittingWork, setSubmittingWork] = useState(false);
  const [savingFeedback, setSavingFeedback] = useState(false);

  const [localTask, setLocalTask] = useState({ ...task });

  useEffect(() => {
    setLocalTask(task);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setTraineeDescription(task.traineeDescription || "");
    setTraineeLink(task.traineeLink || "");
    setManagerFeedback(task.managerFeedback || "");
  }, [task]);

  const validateTaskFields = () => {
    if (!title.trim() || !description.trim()) {
      return "Both task title and description are required.";
    }
    return "";
  };

  const validateSubmissionFields = () => {
    if (!traineeDescription.trim() || !traineeLink.trim()) {
      return "Work description and project link are required.";
    }
    if (!/^https?:\/\//i.test(traineeLink.trim())) {
      return "Project link must start with http:// or https://.";
    }
    return "";
  };

  const handleSaveTask = async () => {
    console.log("Saving task...");
    const errorMsg = validateTaskFields();
    if (errorMsg) {
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    setSavingTask(true);
    const updated = { ...localTask, title, description };
    await onUpdate(date, updated);
    setLocalTask(updated);
    setEditMode(false);
    setError("");
    setSavingTask(false);
    console.log("Task saved.");
  };

  const handleSubmitOrUpdateWork = async (isInitialSubmit = false) => {
    console.log("Submitting work...");
    const errorMsg = validateSubmissionFields();
    if (errorMsg) {
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    const updated = {
      ...localTask,
      traineeDescription,
      traineeLink,
      ...(isInitialSubmit && { completed: true }),
    };

    setSubmittingWork(true);
    setLocalTask(updated);

    if (isInitialSubmit) {
      await onComplete(date, traineeDescription, traineeLink);
    } else {
      await onUpdate(date, updated);
    }

    setSubmissionMode(false);
    setError("");
    setSubmittingWork(false);
    console.log("Work submitted.");
  };

  const handleDeleteTask = async () => {
    console.log("Deleting task...");
    if (window.confirm("Are you sure you want to delete this task?")) {
      setDeletingTask(true);
      await onDelete(date);
      setDeletingTask(false);
      console.log("Task deleted.");
    }
  };

  const handleSaveManagerFeedback = async () => {
    console.log("Saving feedback...");
    if (!managerFeedback.trim()) {
      const errorMsg = "Manager feedback cannot be empty.";
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    setSavingFeedback(true);
    const updated = { ...localTask, managerFeedback };
    await onUpdate(date, updated);
    setLocalTask(updated);
    setError("");
    setSavingFeedback(false);
    console.log("Feedback saved.");
  };

  return (
    <div className="p-6 border rounded-lg shadow bg-white mt-8">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Task Title */}
      <div className="mb-6">
        {editMode ? (
          <input
            type="text"
            autoFocus
            className="w-full p-3 border rounded-md text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
        ) : (
          <h2 className="text-2xl font-bold text-pink-700">{title}</h2>
        )}
      </div>

      {/* Task Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-pink-600 mb-2">
          Task Description
        </h3>
        {editMode ? (
          <textarea
            className="w-full p-3 border rounded-md"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
          />
        ) : (
          <p className="text-gray-700">{description}</p>
        )}
      </div>

      {/* Manager Buttons */}
      {isManager && (
        <div className="flex flex-wrap gap-4 mb-8">
          {editMode ? (
            <button
              onClick={handleSaveTask}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-md"
              disabled={savingTask}
            >
              {savingTask ? "Saving..." : "Save Task"}
            </button>
          ) : (
            <button
              onClick={() => {
                setEditMode(true);
                setError("");
              }}
              className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-5 rounded-md"
            >
              Edit Task
            </button>
          )}
          <button
            onClick={handleDeleteTask}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md"
            disabled={deletingTask}
          >
            {deletingTask ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      )}

      <hr className="my-8" />

      {/* Trainee Submission Section */}
      <div>
        <h3 className="text-xl font-semibold text-pink-700 mb-4">
          Trainee Submission
        </h3>

        {localTask.completed || isManager ? (
          <>
            {/* Work Description */}
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Work Description:</p>
              {submissionMode && !isManager ? (
                <textarea
                  className="w-full p-3 border rounded-md mt-2"
                  rows={3}
                  value={traineeDescription}
                  onChange={(e) => setTraineeDescription(e.target.value)}
                />
              ) : (
                <p className="mt-2 text-gray-600">
                  {traineeDescription || "No submission yet."}
                </p>
              )}
            </div>

            {/* Project Link */}
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Project Link:</p>
              {submissionMode && !isManager ? (
                <input
                  type="text"
                  className="w-full p-3 border rounded-md mt-2"
                  value={traineeLink}
                  onChange={(e) => setTraineeLink(e.target.value)}
                />
              ) : traineeLink ? (
                <a
                  href={traineeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2 block"
                >
                  {traineeLink}
                </a>
              ) : (
                <p className="mt-2 text-gray-600">No link submitted.</p>
              )}
            </div>

            {!isManager && (
              <div className="flex gap-4 mt-4">
                {submissionMode ? (
                  <button
                    onClick={() => handleSubmitOrUpdateWork(false)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-md"
                    disabled={submittingWork}
                  >
                    {submittingWork ? "Saving..." : "Save Changes"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSubmissionMode(true);
                      setError("");
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-5 rounded-md"
                  >
                    Edit Submission
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          !isManager && (
            <div>
              <textarea
                className="w-full p-3 border rounded-md mb-4"
                rows={3}
                placeholder="Describe your work..."
                value={traineeDescription}
                onChange={(e) => setTraineeDescription(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 border rounded-md mb-4"
                placeholder="Project Link (starting with http:// or https://)..."
                value={traineeLink}
                onChange={(e) => setTraineeLink(e.target.value)}
              />
              <button
                onClick={() => handleSubmitOrUpdateWork(true)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md"
                disabled={submittingWork}
              >
                {submittingWork ? "Submitting..." : "Submit Work"}
              </button>
            </div>
          )
        )}
      </div>

      {/* Manager Feedback Section */}
      {isManager && localTask.completed && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-pink-700 mb-4">
            Manager Feedback
          </h3>
          <textarea
            className="w-full p-3 border rounded-md mb-4"
            rows={4}
            value={managerFeedback}
            onChange={(e) => setManagerFeedback(e.target.value)}
            placeholder="Provide feedback for the trainee..."
          />
          <button
            onClick={handleSaveManagerFeedback}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-md"
            disabled={savingFeedback}
          >
            {savingFeedback ? "Saving..." : "Save Feedback"}
          </button>
        </div>
      )}

      {/* Trainee View of Manager Feedback */}
      {!isManager && localTask.completed && localTask.managerFeedback && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-pink-700 mb-4">
            Manager's Feedback
          </h3>
          <p>{localTask.managerFeedback}</p>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;
