import { X } from "lucide-react";

export function GlassModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full max-w-md p-6 border border-white border-opacity-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 text-gray-700">{message}</div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 bg-opacity-70 hover:bg-opacity-100 px-4 py-2 rounded-md transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-md transition-all duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}