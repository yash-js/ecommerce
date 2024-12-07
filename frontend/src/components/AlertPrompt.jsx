import React from "react";
import ReactDOM from "react-dom";

const AlertPrompt = ({ message, onConfirm, onCancel }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-sm w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Confirm Action
          </h3>
          <p className="text-gray-300">{message}</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlertPrompt;
