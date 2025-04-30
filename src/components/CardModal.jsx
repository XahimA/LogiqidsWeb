import { Calendar, Trash, X } from "lucide-react";
import { useState } from "react";

export function CardModal({ card, onClose, onUpdate, onDelete }) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || "");
    const [dueDate, setDueDate] = useState(card.dueDate || "");
    const [completed, setCompleted] = useState(card.completed || false);
  
    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      if (!title.trim()) {
        return; 
      }
      onUpdate({
        ...card,
        title,
        description,
        dueDate,
        completed,
      });
    };
  
    return (
      <div className="p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
  
        <div>
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-4">
            In list: {card.listTitle}
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              rows={4}
              placeholder="Add a more detailed description..."
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Due Date
            </label>
            <div className="flex items-center">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
  
          <div className="mb-6 bg-gray-50 p-3 rounded-md border border-gray-200">
            <label className="flex items-center text-gray-700">
              <div className="relative w-5 h-5 mr-2">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="opacity-0 absolute h-5 w-5 cursor-pointer"
                />
                <div
                  className={`border ${
                    completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  } rounded w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 transition-colors`}
                >
                  {completed && (
                    <svg
                      className="fill-current w-3 h-3 text-white pointer-events-none"
                      viewBox="0 0 20 20"
                    >
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="select-none">Mark as completed</span>
            </label>
          </div>
  
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => onDelete(card.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition-colors shadow-sm"
            >
              <Trash className="mr-1" size={16} />
              Delete
            </button>
  
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  