import React from "react";

export default function Profile({
  isOpen,
  onClose,
  photo,
  name,
  description,
  files,
  links,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-[#35404d] text-white rounded-lg p-6 w-[90%] max-w-md flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl hover:text-red-400"
        >
          &times;
        </button>

        <img
          src={photo}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <h4 className="text-xl font-bold mb-2">{name}</h4>
        <p className="text-sm text-center mb-4">{description}</p>

        <div className="flex gap-6 mt-2">
          <div className="flex flex-col items-center border-2 border-white rounded-md p-3 w-24 cursor-pointer hover:bg-white hover:text-[#35404d] transition">
            <i className="fa fa-folder text-xl text-[#93b1a6] mb-1"></i>
            <span className="text-sm">{files} files</span>
          </div>

          <div className="flex flex-col items-center border-2 border-white rounded-md p-3 w-24 cursor-pointer hover:bg-white hover:text-[#35404d] transition">
            <i className="fa fa-link text-xl text-[#93b1a6] mb-1"></i>
            <span className="text-sm">{links} links</span>
          </div>
        </div>
      </div>
    </div>
  );
}
