import React from "react";

const Modal = ({ onClose, violation }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 backdrop:blur-lg">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 font-serif">More Details</h2>
        <div>
          <strong>Message : </strong>
          {violation.Message}
        </div>
        <div>
          <strong>Time : </strong>
          {violation.Time}
        </div>
        <hr className="bg-black border-t-2 my-3" />
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
