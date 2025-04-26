import React, { useState } from "react";
import PodList from "./PodList";
import ChatContainer from "./ChatContainer";

export default function Pod() {
  const [selectedPod, setSelectedPod] = useState(null);

  const handleSelectPod = (pod) => {
    setSelectedPod(pod);
  };

  const styles = {
    podContainerStyle: {
      display: "grid",
      gridTemplateColumns: "25% 75%",
      backgroundColor: "transparent",
      color: "#fff",
      height: "100vh",
      boxSizing: "border-box",
    },
  };

  return (
    <div className="pod-container" style={styles.podContainerStyle}>
      <PodList onSelectPod={handleSelectPod} />
      <ChatContainer pod={selectedPod} isOpen={!!selectedPod} />
    </div>
  );
}
