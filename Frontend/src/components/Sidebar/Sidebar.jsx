import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Rocket,
  LogOut,
  MoreHorizontal,
  Map,
  PencilIcon,
  LayoutGrid,
  MessageCircle,
  Menu,
  Compass,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (event) => {
      // Check if click is outside both the sidebar and the toggle button
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-16 h-full flex flex-col py-4 transition-all duration-300
      shadow-lg border-t-1 border-gray-300 z-1000
      ${
        expanded
          ? theme === "dark"
            ? "w-48 px-4 bg-gray-900"
            : "w-48 px-4 bg-white"
          : theme === "dark"
          ? "w-16 px-2 bg-gray-900"
          : "w-16 px-2 bg-white"
      }
      ${theme === "dark" ? "text-white" : "text-gray-900"}`}
    >
      {/* Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center p-0 px-3 rounded-lg cursor-pointer"
      >
        <Menu size={24} />
        {expanded && <span className="ml-3"></span>}
      </button>

      {/* Sidebar Items */}
      <nav className="mt-6 flex flex-col space-y-4">
        <Link
          to="/dashboard"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
        >
          <Home size={24} />
          {expanded && <span className="ml-3">Dashboard</span>}
        </Link>
        <Link
          to="/career-path"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
        >
          <Rocket size={24} />
          {expanded && <span className="ml-3">Roadmap</span>}
        </Link>
        <Link
          to="/roadmap-list"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
        >
          <Map size={24} />
          {expanded && <span className="ml-3">Static Roadmap</span>}
        </Link>
        <Link
          to="/explore"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
        >
          <Compass size={24} />
          {expanded && <span className="ml-3">Explore</span>}
        </Link>
        <Link
          to="/pod"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
        >
          <MessageCircle size={24} />
          {expanded && <span className="ml-3">Pods</span>}
        </Link>
        <Link
          to="/whiteboard"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
        >
          <PencilIcon size={24} />
          {expanded && <span className="ml-3">Whiteboard</span>}
        </Link>
        <Link
          to="/"
          className="flex items-center p-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
          onClick={() => localStorage.removeItem("user")}
        >
          <LogOut size={24} />
          {expanded && <span className="ml-3">Logout</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
