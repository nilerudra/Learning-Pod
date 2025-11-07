import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Rocket,
  LogOut,
  Map,
  PencilIcon,
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

  // 🧭 Define all routes here
  const routes = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/career-path", label: "Roadmap", icon: Rocket },
    { path: "/roadmap-list", label: "Static Roadmap", icon: Map },
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/pod", label: "Pods", icon: MessageCircle },
    { path: "/whiteboard", label: "Whiteboard", icon: PencilIcon },
    {
      path: "/",
      label: "Logout",
      icon: LogOut,
      onClick: () => localStorage.removeItem("user"),
    },
  ];

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
        {routes.map(({ path, label, icon: Icon, onClick }) => (
          <Link
            key={label}
            to={path}
            onClick={onClick}
            className="flex items-center p-3 rounded-lg hover:bg-gradient-to-tr from-purple-500/50 to-transparent hover:text-white transition"
          >
            <Icon size={24} />
            {expanded && <span className="ml-3">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
