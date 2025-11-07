import React from "react";
import { Trophy, BookOpen } from "lucide-react";

export default function ProfileHeader({ user, totalRoadmaps }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#0f172a] shadow-lg shadow-blue-500/10 border border-white/10 p-6">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-400/10 to-transparent blur-3xl opacity-30" />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-5 text-white">
          <div className="relative">
            <img
              src={user.photo || "https://via.placeholder.com/100"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover shadow-md shadow-blue-400/20"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111827]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <p className="text-gray-300 text-sm">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div className="flex flex-col sm:flex-row gap-8 text-center text-white">
          <div className="bg-gradient-to-tr from-blue-600/20 to-transparent p-4 rounded-xl border border-blue-500/20 hover:scale-105 transition">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="text-blue-400" size={22} />
              <h3 className="text-2xl font-bold text-blue-400 ">
                {totalRoadmaps}
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
              Roadmaps Generated
            </p>
          </div>

          <div className="bg-gradient-to-tr from-green-600/20 to-transparent p-4 rounded-xl border border-green-500/20 hover:scale-105 transition">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="text-green-400" size={22} />
              <h3 className="text-2xl font-bold text-green-400">
                {user.completedTopics || 0}
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
              Topics Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
