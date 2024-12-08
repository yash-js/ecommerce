import { Loader } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";

const AlertPrompt = ({ message, onConfirm, onCancel, loading = false }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 shadow-2xl shadow-black bg-black ">
      <div className="text-[#4d3900] bg-white rounded-lg  max-w-sm w-full border border-1 border-[#ffbc05]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#4d3900] mb-4">
            Confirm Action
          </h3>
          <p className="text-gray-600">{message}</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-4 00"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#febe03] text-white rounded-lg hover:bg-yellow-400"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin duration-1000" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlertPrompt;
