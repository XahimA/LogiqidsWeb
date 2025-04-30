import { Plus } from "lucide-react";
import { useState } from "react";

export function AddCardForm({ listId, onAddCard }) {
  const [showForm, setShowForm] = useState(false);
  const [cardTitle, setCardTitle] = useState("");

  const handleSubmit = () => {
    if (cardTitle.trim()) {
      onAddCard(listId, cardTitle);
      setCardTitle("");
      setShowForm(false);
    }
  };

  return (
    <div className="p-2 border-t border-white border-opacity-20">
      {showForm ? (
        <div className="p-2 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-md shadow-inner">
          <textarea
            className="w-full p-3 bg-white bg-opacity-80 border border-blue-300 rounded-md mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-300"
            placeholder="Enter card title..."
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={3}
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-md hover:shadow-md transition-all duration-300"
              onClick={handleSubmit}
            >
              Add Card
            </button>
            <button
              className="bg-white bg-opacity-30 text-gray-700 px-3 py-2 rounded-md hover:bg-opacity-50 transition-all duration-300"
              onClick={() => {
                setShowForm(false);
                setCardTitle("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="w-full text-left text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-md transition-all duration-300 flex items-center"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} className="mr-1" />
          Add a card
        </button>
      )}
    </div>
  );
}
