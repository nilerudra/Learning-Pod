import React, { useState } from "react";
import { FaCopy } from "react-icons/fa6";

export default function PodItem({ community, onSelect }) {
  const [copied, setCopied] = useState(false);

  const styles = {
    listItem: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      boxShadow: "0 .5px 0 rgba(225, 225, 225, 0.3)",
      justifyContent: "flex-start",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    profileImage: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "15px",
    },
    listItemText: {
      display: "flex",
      flexDirection: "column",
    },
    listItemName: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#fff",
    },
    listItemDescription: {
      fontSize: ".75rem",
      color: "#ddd",
      display: "flex",
      alignItems: "center",
    },
    copyIcon: {
      cursor: "pointer",
      marginLeft: "5px",
      fontSize: "16px",
      verticalAlign: "middle",
      color: "#00c3ff",
      transition: "color 0.2s",
    },
    copyAlert: {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#28a745",
      color: "#fff",
      padding: "10px 15px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "bold",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      animation: "fadeInOut 2s ease-in-out",
      zIndex: 1000,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(community.unique_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide alert after 2s
  };

  return (
    <>
      <div className="list-item" onClick={onSelect} style={styles.listItem}>
        <img
          src={community.profileImage}
          alt="Pod Profile"
          style={styles.profileImage}
        />
        <div className="list-item-text" style={styles.listItemText}>
          <span className="list-item-name" style={styles.listItemName}>
            {community.pod_name}
          </span>
          <span
            className="list-item-description"
            style={styles.listItemDescription}
          >
            Code: {community.unique_code}
            <FaCopy
              onClick={(e) => {
                e.stopPropagation(); // Prevent list item click
                handleCopy();
              }}
              style={styles.copyIcon}
            />
          </span>
          <span
            className="list-item-description"
            style={styles.listItemDescription}
          >
            {community.pod_description}
          </span>
        </div>
      </div>

      {/* Copy Alert */}
      {copied && (
        <div style={styles.copyAlert}>✅ Code copied to clipboard!</div>
      )}

      {/* Fade In/Out Animation */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .list-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          .list-item .fa-copy:hover {
            color: #00a3ff;
          }
        `}
      </style>
    </>
  );
}
