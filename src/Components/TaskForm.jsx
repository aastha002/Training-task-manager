import { useState } from "react";

function TaskForm({ onAdd, selectedDate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please fill in both Title and Description.");
      return;
    }

    onAdd({ title, description, links });
    setTitle("");
    setDescription("");
    setLinks("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
        Assign Task - {selectedDate.toDateString()}
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <div className="mb-5">
        <label className="block text-pink-700 font-semibold mb-2">
          Task Title
        </label>
        <input
          type="text"
          placeholder="Enter Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
        />
      </div>

      <div className="mb-5">
        <label className="block text-pink-700 font-semibold mb-2">
          Task Description
        </label>
        <textarea
          placeholder="Enter Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition resize-none"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-pink-700 font-semibold mb-2">
          Related Links (optional)
        </label>
        <input
          type="text"
          placeholder="Provide links separated by commas"
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 transition text-white font-semibold py-2 px-8 rounded-full shadow-md hover:shadow-lg"
        >
          Assign Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
