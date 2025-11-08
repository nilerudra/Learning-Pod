import React, { useState } from "react";
import PodList from "./PodList";
import ChatContainer from "./ChatContainer";

export default function Pod() {
  const [selectedPod, setSelectedPod] = useState(null);

  const handleSelectPod = (pod) => {
    setSelectedPod(pod);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-transparent text-white">
      {/* Pod List */}
      <div
        className={`
          w-full md:w-1/4  
          ${selectedPod ? "md:block hidden" : "block"} 
          overflow-y-auto
          border-r border-gray-700
        `}
      >
        <PodList onSelectPod={handleSelectPod} />
      </div>

      {/* Chat Container */}
      {selectedPod && (
        <div className="w-full md:w-3/4 h-full">
          <ChatContainer pod={selectedPod} isOpen={!!selectedPod} />
        </div>
      )}
    </div>
  );
}
