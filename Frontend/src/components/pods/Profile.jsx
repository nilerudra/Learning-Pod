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

  // Generate initials if no photo
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="relative w-[90%] max-w-md bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a] border border-gray-700 shadow-xl rounded-2xl p-6 flex flex-col items-center backdrop-blur-md text-gray-200 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-2xl font-bold transition-all"
        >
          &times;
        </button>

        {/* Profile Image or Initials */}
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-gray-700"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-purple-600 text-white text-2xl font-bold border-2 border-gray-700">
            {getInitials(name)}
          </div>
        )}

        {/* Name & Description */}
        <h4 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
          {name}
        </h4>
        <p className="text-sm text-center text-gray-400 mb-4">{description}</p>

        {/* Files & Links Cards */}
        <div className="flex gap-4 mt-2 w-full justify-center">
          <div className="flex flex-col items-center bg-gray-700/60 border border-gray-600 rounded-lg p-3 w-28 hover:bg-gray-700 hover:text-purple-400 cursor-pointer transition-all backdrop-blur-sm">
            <i className="fa fa-folder text-xl mb-1"></i>
            <span className="text-sm">{files} files</span>
          </div>

          <div className="flex flex-col items-center bg-gray-700/60 border border-gray-600 rounded-lg p-3 w-28 hover:bg-gray-700 hover:text-purple-400 cursor-pointer transition-all backdrop-blur-sm">
            <i className="fa fa-link text-xl mb-1"></i>
            <span className="text-sm">{links} links</span>
          </div>
        </div>
      </div>
    </div>
  );
}
