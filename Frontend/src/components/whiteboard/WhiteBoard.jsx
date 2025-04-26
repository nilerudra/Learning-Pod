import { useState, useRef, useEffect } from "react";

export default function WhiteboardApp() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("pencil"); // 'pencil', 'eraser', 'text', 'sticky'
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isAddingText, setIsAddingText] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [newStickyPosition, setNewStickyPosition] = useState({ x: 0, y: 0 });
  const [isAddingSticky, setIsAddingSticky] = useState(false);
  const [stickyInput, setStickyInput] = useState("");
  const [activeStickyId, setActiveStickyId] = useState(null);
  const [isDraggingSticky, setIsDraggingSticky] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // New state variables for save functionality
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [fileName, setFileName] = useState("pathwayx-drawing");
  const [savedFiles, setSavedFiles] = useState([]);

  const colors = [
    "#000000",
    "#FF5252",
    "#4CAF50",
    "#2196F3",
    "#FFC107",
    "#9C27B0",
    "#607D8B",
  ];
  const stickyColors = ["#FFEB3B", "#FF9800", "#E91E63", "#4CAF50", "#2196F3"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;

    // Resize canvas to fill the container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Load saved files from localStorage
    const savedFilesData = localStorage.getItem("pathwayxSavedFiles");
    if (savedFilesData) {
      setSavedFiles(JSON.parse(savedFilesData));
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;

    if (tool === "text") {
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = color;
    }
  }, [color, brushSize, tool, fontSize]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setHistory([...history, canvas.toDataURL()]);
    setRedoStack([]);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a sticky note first
    const clickedSticky = stickyNotes.find(
      (note) =>
        x >= note.x && x <= note.x + 200 && y >= note.y && y <= note.y + 200
    );

    if (clickedSticky) {
      setActiveStickyId(clickedSticky.id);
      setIsDraggingSticky(true);
      setDragOffset({
        x: x - clickedSticky.x,
        y: y - clickedSticky.y,
      });
      return;
    }

    if (tool === "text") {
      setTextPosition({ x, y });
      setIsAddingText(true);
    } else if (tool === "sticky") {
      setNewStickyPosition({ x, y });
      setIsAddingSticky(true);
    } else {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      saveCanvasState();
    }
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingSticky && activeStickyId) {
      // Move sticky note
      setStickyNotes((notes) =>
        notes.map((note) =>
          note.id === activeStickyId
            ? { ...note, x: x - dragOffset.x, y: y - dragOffset.y }
            : note
        )
      );
      return;
    }

    if (!isDrawing || tool === "text" || tool === "sticky") return;

    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDraggingSticky) {
      setIsDraggingSticky(false);
      setActiveStickyId(null);
      return;
    }

    if (tool !== "text" && tool !== "sticky") {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const addTextToCanvas = () => {
    if (!textInput.trim()) {
      setIsAddingText(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    saveCanvasState();

    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setTextInput("");
    setIsAddingText(false);
  };

  const addStickyNote = () => {
    if (!stickyInput.trim()) {
      setIsAddingSticky(false);
      return;
    }

    const newSticky = {
      id: Date.now(),
      text: stickyInput,
      x: newStickyPosition.x,
      y: newStickyPosition.y,
      color: stickyColors[Math.floor(Math.random() * stickyColors.length)],
    };

    setStickyNotes([...stickyNotes, newSticky]);
    setStickyInput("");
    setIsAddingSticky(false);
  };

  const deleteSticky = (id) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    saveCanvasState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Also clear sticky notes
    setStickyNotes([]);
  };

  const undo = () => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const lastState = history.pop();
    setHistory([...history]);
    setRedoStack([...redoStack, canvas.toDataURL()]);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastState;
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const nextState = redoStack.pop();
    setRedoStack([...redoStack]);
    setHistory([...history, canvas.toDataURL()]);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = nextState;
  };

  // New save functionality
  const saveCanvas = () => {
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas that includes sticky notes
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw the original canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Draw sticky notes
    stickyNotes.forEach((note) => {
      // Draw sticky note background
      tempCtx.fillStyle = note.color;
      tempCtx.fillRect(note.x, note.y, 200, 200);

      // Draw sticky note border
      tempCtx.strokeStyle = "#00000033";
      tempCtx.lineWidth = 1;
      tempCtx.strokeRect(note.x, note.y, 200, 200);

      // Draw sticky note text
      tempCtx.fillStyle = "#000000";
      tempCtx.font = "16px sans-serif";

      // Wrap text for sticky note
      const words = note.text.split(" ");
      let line = "";
      let y = note.y + 30;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = tempCtx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > 180 && i > 0) {
          tempCtx.fillText(line, note.x + 10, y);
          line = words[i] + " ";
          y += 20;
        } else {
          line = testLine;
        }
      }
      tempCtx.fillText(line, note.x + 10, y);
    });

    // Get data URL from canvas
    const dataURL = tempCanvas.toDataURL("image/png");

    // Save to localStorage
    const newFile = {
      id: Date.now(),
      name: fileName.trim() || "pathwayx-drawing",
      dataURL,
      date: new Date().toLocaleString(),
    };

    const updatedFiles = [...savedFiles, newFile];
    setSavedFiles(updatedFiles);
    localStorage.setItem("pathwayxSavedFiles", JSON.stringify(updatedFiles));

    setShowSaveDialog(false);
    setFileName("pathwayx-drawing");

    // Show save confirmation message
    alert(`File "${newFile.name}" saved successfully!`);
  };

  const downloadCanvas = () => {
    // Create a temporary canvas that includes sticky notes
    const tempCanvas = document.createElement("canvas");
    const canvas = canvasRef.current;
    if (!canvas) return;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw the original canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Draw sticky notes
    stickyNotes.forEach((note) => {
      // Draw sticky note background
      tempCtx.fillStyle = note.color;
      tempCtx.fillRect(note.x, note.y, 200, 200);

      // Draw sticky note border
      tempCtx.strokeStyle = "#00000033";
      tempCtx.lineWidth = 1;
      tempCtx.strokeRect(note.x, note.y, 200, 200);

      // Draw sticky note text
      tempCtx.fillStyle = "#000000";
      tempCtx.font = "16px sans-serif";

      // Wrap text for sticky note
      const words = note.text.split(" ");
      let line = "";
      let y = note.y + 30;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = tempCtx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > 180 && i > 0) {
          tempCtx.fillText(line, note.x + 10, y);
          line = words[i] + " ";
          y += 20;
        } else {
          line = testLine;
        }
      }
      tempCtx.fillText(line, note.x + 10, y);
    });

    // Download the combined image
    const link = document.createElement("a");
    link.download = `${fileName.trim() || "pathwayx-drawing"}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
  };

  const loadSavedFile = (file) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear current canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load saved image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = file.dataURL;

    // Clear sticky notes (as they're part of the saved image now)
    setStickyNotes([]);

    // Reset history and redo stack
    setHistory([]);
    setRedoStack([]);

    // Save current state after loading
    setTimeout(() => {
      saveCanvasState();
    }, 100);
  };

  const deleteSavedFile = (id) => {
    const updatedFiles = savedFiles.filter((file) => file.id !== id);
    setSavedFiles(updatedFiles);
    localStorage.setItem("pathwayxSavedFiles", JSON.stringify(updatedFiles));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg">PathwayX</span>

          <div className="flex space-x-1">
            <button
              className={`p-2 rounded ${
                tool === "pencil" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("pencil")}
            >
              Pencil
            </button>
            <button
              className={`p-2 rounded ${
                tool === "eraser" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("eraser")}
            >
              Eraser
            </button>
            <button
              className={`p-2 rounded ${
                tool === "text" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("text")}
            >
              Text
            </button>
            <button
              className={`p-2 rounded ${
                tool === "sticky" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("sticky")}
            >
              Sticky Note
            </button>
            <button className="p-2 rounded bg-gray-700" onClick={clearCanvas}>
              Clear All
            </button>
          </div>

          {tool === "text" && (
            <div className="flex items-center">
              <span className="mr-2">Font Size:</span>
              <input
                type="range"
                min="10"
                max="60"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-24"
              />
              <span className="ml-2">{fontSize}px</span>
            </div>
          )}

          {(tool === "pencil" || tool === "eraser") && (
            <div className="flex items-center">
              <span className="mr-2">Size:</span>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24"
              />
              <span className="ml-2">{brushSize}px</span>
            </div>
          )}

          {tool !== "sticky" && (
            <div className="flex">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 mx-1 rounded-full ${
                    color === c ? "ring-2 ring-white" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 mx-1 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="flex">
          <button
            className="p-2 mx-1 rounded bg-gray-700"
            onClick={undo}
            disabled={history.length === 0}
          >
            Undo
          </button>
          <button
            className="p-2 mx-1 rounded bg-gray-700"
            onClick={redo}
            disabled={redoStack.length === 0}
          >
            Redo
          </button>
          <button className="p-2 mx-1 rounded bg-blue-600" onClick={saveCanvas}>
            Save
          </button>
          <button
            className="p-2 mx-1 rounded bg-gray-700"
            onClick={() => setShowSaveDialog(true)}
          >
            Download
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 bg-white relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Sticky notes */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            className="absolute shadow-lg cursor-move"
            style={{
              left: note.x + "px",
              top: note.y + "px",
              width: "200px",
              height: "auto",
              minHeight: "200px",
              backgroundColor: note.color,
              padding: "10px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => deleteSticky(note.id)}
            >
              ×
            </button>
            <div className="mt-4 overflow-y-auto max-h-40">{note.text}</div>
          </div>
        ))}

        {/* Text input overlay */}
        {isAddingText && (
          <div
            className="absolute bg-gray-800 bg-opacity-90 p-3 rounded shadow-lg"
            style={{
              left: textPosition.x + "px",
              top: textPosition.y + "px",
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
              className="block w-64 p-2 mb-2 text-black rounded"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingText(false)}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addTextToCanvas}
                className="px-3 py-1 bg-blue-600 rounded"
              >
                Add Text
              </button>
            </div>
          </div>
        )}

        {/* Sticky note input overlay */}
        {isAddingSticky && (
          <div
            className="absolute bg-gray-800 bg-opacity-90 p-3 rounded shadow-lg"
            style={{
              left: newStickyPosition.x + "px",
              top: newStickyPosition.y + "px",
            }}
          >
            <textarea
              value={stickyInput}
              onChange={(e) => setStickyInput(e.target.value)}
              placeholder="Enter note content..."
              className="block w-64 h-32 p-2 mb-2 text-black rounded"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingSticky(false)}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addStickyNote}
                className="px-3 py-1 bg-blue-600 rounded"
              >
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* Save/Download Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Save Drawing</h3>

              <div className="mb-4">
                <label className="block mb-2">File Name:</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name..."
                  className="w-full p-2 text-black rounded"
                  autoFocus
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 mr-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadCanvas}
                  className="px-4 py-2 mr-2 bg-green-600 rounded"
                >
                  Download
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-blue-600 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Files Sidebar Button */}
        <button
          className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full shadow-lg"
          onClick={() => {
            const sidebar = document.getElementById("saved-files-sidebar");
            if (sidebar) {
              sidebar.classList.toggle("translate-x-full");
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
            />
          </svg>
        </button>

        {/* Saved Files Sidebar */}
        <div
          id="saved-files-sidebar"
          className="fixed top-0 right-0 h-full w-72 bg-gray-800 shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-40 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold">Saved Whiteboards</h3>
            <p className="text-sm text-gray-400">Click on a file to load</p>
          </div>

          <div className="p-4">
            {savedFiles.length === 0 ? (
              <p className="text-gray-400">No saved files yet</p>
            ) : (
              <ul className="space-y-2">
                {savedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="bg-gray-700 rounded p-2 cursor-pointer hover:bg-gray-600"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="flex-1 truncate"
                        onClick={() => loadSavedFile(file)}
                      >
                        {file.name}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-300"
                        onClick={() => deleteSavedFile(file.id)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">{file.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
