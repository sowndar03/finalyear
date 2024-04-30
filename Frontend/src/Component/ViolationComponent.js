import React, { useState } from "react";
import Modal from "./Modal";

const ViolationComponent = ({ violation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-sm w-3/4 bg-gray-300 p-2 rounded overflow-hidden items-center flex flex-col justify-center  shadow-lg">
      <img className="w-3/4" src={violation.Image} alt={violation.Reg_no} />
      <div className="px-6 py-4 w-3/4 flex flex-col items-center">
        <div className="font-bold text-xl mb-2">{violation.Reg_no}</div>
        <p className="text-gray-700 text-base">
          Owner Name: {violation.Owner_name}
        </p>
        <p className="text-gray-700 text-base">
          Driver Name: {violation.Driver_name}
        </p>
        <p className="text-gray-700 text-base">
          Model Year: {violation.model}
        </p>
        <button 
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 "
        >
          View More
        </button>
        {isModalOpen && (
          <Modal violation={violation} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default ViolationComponent;
