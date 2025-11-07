// Whiteboard.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { Save, Download, RotateCcw, RotateCw, Trash2, Eye } from "lucide-react";

/**
 * Whiteboard component — feature-rich single-file implementation.
 *
 * Requirements:
 *  - Tailwind CSS
 *  - socket.io-client
 *  - axios
 *  - uuid
 *  - framer-motion
 *  - react-rnd
 *
 * Props (optional):
 *  - userId (string) - current user id for backend
 *  - socketUrl (string) - URL for socket.io server
 *  - api (object) - optional backend endpoints: { saveUrl, loadUrl, listUrl }
 *
 * Notes:
 *  - Backend integration points are clearly marked. If you don't have a backend,
 *    component will still function with localStorage-based saving.
 */

export default function Whiteboard() {
  // Canvas refs + states
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil"); // pencil, eraser, text, sticky
  const [color, setColor] = useState("#fff");
  const [brushSize, setBrushSize] = useState(4);
  const [fontSize, setFontSize] = useState(20);

  // Sticky notes & text
  const [stickies, setStickies] = useState([]); // { id, x, y, width, height, text, color, z }
  const [isAddingSticky, setIsAddingSticky] = useState(false);
  const [newStickyPos, setNewStickyPos] = useState({ x: 100, y: 100 });

  const [textOverlay, setTextOverlay] = useState(null); // { x,y, value, id }

  // Undo/redo stacks store snapshots + sticky state
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Saved files
  const [savedFiles, setSavedFiles] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [fileName, setFileName] = useState("pathwayx-whiteboard");

  // UI
  const [showSavedSidebar, setShowSavedSidebar] = useState(false);

  // Collaboration throttle
  const drawThrottleRef = useRef(null);

  // Colors
  const colors = [
    "#fff",
    "#FF5252",
    "#4CAF50",
    "#2196F3",
    "#FFC107",
    "#9C27B0",
    "#607D8B",
  ];

  // ---------- Setup canvas and socket ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // preserve drawing by copying current image
      const tmp = document.createElement("canvas");
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      tmp.getContext("2d").drawImage(canvas, 0, 0);

      const parent = containerRef.current;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const ctx = canvas.getContext("2d");
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;

      // draw back previous
      ctx.drawImage(
        tmp,
        0,
        0,
        tmp.width,
        tmp.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    resize();
    window.addEventListener("resize", resize);

    // load saved files from localStorage
    const local = localStorage.getItem("pathwayxSavedFiles");
    if (local) setSavedFiles(JSON.parse(local));

    return () => window.removeEventListener("resize", resize);
  }, []); // run once

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";
    if (tool === "text") {
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = color;
    }
  }, [brushSize, color, tool, fontSize]);

  // ---------- Drawing logic ----------
  const saveCanvasSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const data = canvas.toDataURL();
      setHistory((h) => [
        ...h,
        { img: data, stickies: JSON.parse(JSON.stringify(stickies)) },
      ]);
      setRedoStack([]);
    } catch (err) {
      console.warn("snapshot failed", err);
    }
  }, [stickies]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const toCanvasCoords = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  };

  // store active path for broadcasting
  const activePathRef = useRef(null);

  const handleMouseDown = (e) => {
    if (tool === "sticky") {
      // start sticky creation at pointer
      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      setNewStickyPos({ x, y });
      setIsAddingSticky(true);
      return;
    }
    if (tool === "text") {
      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      const id = uuidv4();
      setTextOverlay({ x, y, value: "", id });
      return;
    }

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    const ctx = getCanvasContext();
    if (!ctx) return;

    // Begin path
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    saveCanvasSnapshot();

    // remote begin
    activePathRef.current = {
      id: uuidv4(),
      points: [{ x, y }],
      color,
      size: brushSize,
      tool,
    };
    if (socket && socket.connected)
      socket.emit("draw", { action: "begin", path: activePathRef.current });
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    const { x, y } = toCanvasCoords(e.clientX, e.clientY);

    // drawing
    if (isDrawing && tool !== "text" && tool !== "sticky") {
      ctx.lineTo(x, y);
      ctx.stroke();

      // accumulate for remote broadcast, but throttle
      if (activePathRef.current) {
        activePathRef.current.points.push({ x, y });
        if (!drawThrottleRef.current) {
          drawThrottleRef.current = setTimeout(() => {
            clearTimeout(drawThrottleRef.current);
            drawThrottleRef.current = null;
          }, 40);
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && tool !== "text" && tool !== "sticky") {
      const ctx = getCanvasContext();
      if (ctx) ctx.closePath();
      setIsDrawing(false);

      activePathRef.current = null;
    }
  };

  // Remote draw handler: apply a path from others
  const handleRemoteDraw = (payload) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = getCanvasContext();
      if (!ctx) return;
      const { action, path } = payload; // path has points[], color, size, tool
      if (!path || !path.points || path.points.length === 0) return;

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = path.size || 4;
      ctx.strokeStyle =
        path.tool === "eraser" ? "#ffffff" : path.color || "#111";
      ctx.globalCompositeOperation =
        path.tool === "eraser" ? "destination-out" : "source-over";

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    } catch (err) {
      console.warn("remote draw error", err);
    }
  };

  // ---------- Sticky handling & remote ----------
  const addSticky = (sticky) => {
    setStickies((s) => {
      const next = [...s, sticky];
      // broadcast

      return next;
    });
  };

  const updateSticky = (sticky) => {
    setStickies((s) => {
      const next = s.map((st) =>
        st.id === sticky.id ? { ...st, ...sticky } : st
      );

      return next;
    });
  };

  const deleteSticky = (id) => {
    setStickies((s) => {
      const next = s.filter((st) => st.id !== id);

      return next;
    });
  };

  const handleRemoteSticky = (payload) => {
    const { action } = payload;
    if (action === "add") {
      const { sticky } = payload;
      setStickies((s) =>
        s.some((x) => x.id === sticky.id) ? s : [...s, sticky]
      );
    } else if (action === "update") {
      const { sticky } = payload;
      setStickies((s) =>
        s.map((st) => (st.id === sticky.id ? { ...st, ...sticky } : st))
      );
    } else if (action === "delete") {
      const { stickyId } = payload;
      setStickies((s) => s.filter((st) => st.id !== stickyId));
    }
  };

  // Text overlay submit
  const submitTextOverlay = () => {
    if (!textOverlay) return;
    const { x, y, value, id } = textOverlay;
    if (!value || value.trim() === "") {
      setTextOverlay(null);
      return;
    }
    const ctx = getCanvasContext();
    if (!ctx) return;
    saveCanvasSnapshot();
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);

    // broadcast

    setTextOverlay(null);
  };

  const handleRemoteText = (payload) => {
    // payload: { id, x, y, value, color, fontSize }
    try {
      const { x, y, value, color: c, fontSize: fs } = payload;
      const ctx = getCanvasContext();
      if (!ctx) return;
      ctx.font = `${fs || 20}px sans-serif`;
      ctx.fillStyle = c || "#111";
      ctx.fillText(value, x, y);
    } catch (err) {
      console.warn("remote text draw failed", err);
    }
  };

  // ---------- Undo / Redo ----------
  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;
    const last = history[history.length - 1];
    const remaining = history.slice(0, history.length - 1);
    setHistory(remaining);
    setRedoStack((r) => [
      ...r,
      {
        img: canvas.toDataURL(),
        stickies: JSON.parse(JSON.stringify(stickies)),
      },
    ]);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      // restore sticky state snapshot if included
      if (last.stickies) setStickies(last.stickies);
    };
    img.src = last.img;
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, r.length - 1));
    setHistory((h) => [
      ...h,
      {
        img: canvasRef.current.toDataURL(),
        stickies: JSON.parse(JSON.stringify(stickies)),
      },
    ]);

    const ctx = getCanvasContext();
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
      if (next.stickies) setStickies(next.stickies);
    };
    img.src = next.img;
  };

  // ---------- Save / Download ----------
  const downloadCombinedImage = (name) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tctx = temp.getContext("2d");
    tctx.drawImage(canvas, 0, 0);

    // draw stickies on temp
    stickies.forEach((s) => {
      tctx.fillStyle = s.color || "#FFEB3B";
      tctx.fillRect(s.x, s.y, s.width, s.height);
      tctx.strokeStyle = "#00000033";
      tctx.strokeRect(s.x, s.y, s.width, s.height);
      tctx.fillStyle = "#000";
      tctx.font = "14px sans-serif";
      // simple wrap
      const words = s.text.split(" ");
      let line = "";
      let y = s.y + 20;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const m = tctx.measureText(testLine).width;
        if (m > s.width - 20 && i > 0) {
          tctx.fillText(line, s.x + 10, y);
          line = words[i] + " ";
          y += 18;
        } else {
          line = testLine;
        }
      }
      tctx.fillText(line, s.x + 10, y);
    });

    const url = temp.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || fileName}.png`;
    a.click();
  };

  const confirmSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tctx = temp.getContext("2d");
    tctx.drawImage(canvas, 0, 0);

    // draw stickies
    stickies.forEach((s) => {
      tctx.fillStyle = s.color || "#FFEB3B";
      tctx.fillRect(s.x, s.y, s.width, s.height);
      tctx.strokeStyle = "#00000033";
      tctx.strokeRect(s.x, s.y, s.width, s.height);
      tctx.fillStyle = "#000";
      tctx.font = "14px sans-serif";
      const words = s.text.split(" ");
      let line = "";
      let y = s.y + 20;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const m = tctx.measureText(testLine).width;
        if (m > s.width - 20 && i > 0) {
          tctx.fillText(line, s.x + 10, y);
          line = words[i] + " ";
          y += 18;
        } else {
          line = testLine;
        }
      }
      tctx.fillText(line, s.x + 10, y);
    });

    const dataURL = temp.toDataURL("image/png");
    const newFile = {
      id: Date.now(),
      name: fileName.trim() || "pathwayx-whiteboard",
      dataURL,
      date: new Date().toLocaleString(),
    };

    // update localStorage
    const next = [...savedFiles, newFile];
    setSavedFiles(next);
    localStorage.setItem("pathwayxSavedFiles", JSON.stringify(next));

    setShowSaveModal(false);
    setFileName("pathwayx-whiteboard");
    alert(`Saved "${newFile.name}"`);
  };

  const loadSavedFile = (file) => {
    // load image onto canvas
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = getCanvasContext();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      // note: stickies are flattened into image — we clear them
      setStickies([]);
      setHistory([]);
      setRedoStack([]);
    };
    img.src = file.dataURL;
  };

  const deleteSaved = (id) => {
    const next = savedFiles.filter((f) => f.id !== id);
    setSavedFiles(next);
    localStorage.setItem("pathwayxSavedFiles", JSON.stringify(next));
    // backend delete if you have endpoint
  };

  // ---------- Shortcuts ----------
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if (
        (mod && e.key.toLowerCase() === "y") ||
        (mod && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
      } else if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setShowSaveModal(true);
      } else if (!mod) {
        // quick tool switches
        if (e.key.toLowerCase() === "b") setTool("pencil");
        if (e.key.toLowerCase() === "e") setTool("eraser");
        if (e.key.toLowerCase() === "t") setTool("text");
        if (e.key.toLowerCase() === "n") setTool("sticky");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, redoStack, stickies]);

  // ---------- Remote event helpers ----------
  // On receiving remote text we already draw in handleRemoteText
  // On receiving remote sticky, handled earlier

  // ---------- UI render ----------
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg">PathwayX</div>

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded ${
                tool === "pencil" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("pencil")}
            >
              Pencil
            </button>
            <button
              className={`px-3 py-1 rounded ${
                tool === "eraser" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("eraser")}
            >
              Eraser
            </button>
            <button
              className={`px-3 py-1 rounded ${
                tool === "text" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("text")}
            >
              Text
            </button>
            <button
              className={`px-3 py-1 rounded ${
                tool === "sticky" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setTool("sticky")}
            >
              Sticky
            </button>
          </div>

          {/* Brush / Color */}
          <div className="flex items-center gap-3 ml-4">
            {(tool === "pencil" || tool === "eraser") && (
              <>
                <label className="text-sm">Size</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-28"
                />
                <div className="flex items-center gap-1">
                  {colors.map((c) => (
                    <button
                      aria-label={`color-${c}`}
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border ${
                        color === c ? "ring-2 ring-white" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </>
            )}

            {tool === "text" && (
              <div className="flex items-center gap-2">
                <label className="text-sm">Font</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-24"
                />
                <div className="text-sm">{fontSize}px</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            title="Undo (Ctrl+Z)"
            onClick={undo}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            <RotateCcw size={16} />
          </button>
          <button
            title="Redo (Ctrl+Y)"
            onClick={redo}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            <RotateCw size={16} />
          </button>

          <button
            title="Save"
            onClick={() => setShowSaveModal(true)}
            className="p-2 rounded bg-blue-600 hover:bg-blue-500 flex items-center gap-2"
          >
            <Save size={16} /> Save
          </button>

          <button
            title="Download"
            onClick={() => downloadCombinedImage()}
            className="p-2 rounded bg-green-600 hover:bg-green-500 flex items-center gap-2"
          >
            <Download size={16} /> Download
          </button>

          <button
            title="Saved Files"
            onClick={() => setShowSavedSidebar((v) => !v)}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 ml-2"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Canvas + overlays */}
      <div className="flex-1 relative" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Stickies (draggable & resizable) */}
        {stickies.map((s) => (
          <Rnd
            key={s.id}
            size={{ width: s.width || 200, height: s.height || 200 }}
            position={{ x: s.x, y: s.y }}
            onDragStop={(e, d) => updateSticky({ ...s, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) =>
              updateSticky({
                ...s,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y,
              })
            }
            minWidth={120}
            minHeight={80}
            style={{ zIndex: s.z || 10 }}
          >
            <motion.div
              layout
              initial={{ opacity: 0.85 }}
              whileHover={{ opacity: 1 }}
              className="p-3 rounded shadow-lg"
              style={{
                background: s.color || "#FFEB3B",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium text-sm">Note</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => deleteSticky(s.id)}
                    className="text-red-600 px-1 rounded hover:bg-white/20"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <textarea
                value={s.text}
                onChange={(e) => updateSticky({ ...s, text: e.target.value })}
                className="w-full mt-2 bg-transparent resize-none outline-none text-sm"
                style={{ minHeight: 100 }}
              />
            </motion.div>
          </Rnd>
        ))}

        {/* Text overlay input */}
        {textOverlay && (
          <div
            style={{
              position: "absolute",
              left: textOverlay.x,
              top: textOverlay.y,
              zIndex: 9999,
            }}
          >
            <div className="bg-white p-2 rounded shadow-md text-gray-900">
              <input
                autoFocus
                className="outline-none p-1 text-sm w-64"
                value={textOverlay.value}
                onChange={(e) =>
                  setTextOverlay((t) => ({ ...t, value: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitTextOverlay();
                }}
                placeholder="Enter text and press Enter"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-2 py-1 text-sm bg-gray-200 rounded"
                  onClick={() => setTextOverlay(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-2 py-1 text-sm bg-blue-600 rounded text-white"
                  onClick={submitTextOverlay}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New sticky creation modal */}
        {isAddingSticky && (
          <div
            style={{
              position: "absolute",
              left: newStickyPos.x,
              top: newStickyPos.y,
              zIndex: 9999,
            }}
          >
            <div className="bg-white text-gray-900 p-3 rounded shadow-md w-64">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-semibold">New Sticky</div>
                <div>
                  <button
                    className="px-2 py-1 text-sm bg-gray-200 rounded"
                    onClick={() => setIsAddingSticky(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                rows={4}
                placeholder="Type note..."
                value={newStickyPos.text || ""}
                onChange={(e) =>
                  setNewStickyPos((p) => ({ ...p, text: e.target.value }))
                }
                className="w-full p-2 rounded border"
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => {
                    setIsAddingSticky(false);
                  }}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const sticky = {
                      id: uuidv4(),
                      x: newStickyPos.x,
                      y: newStickyPos.y,
                      width: 220,
                      height: 160,
                      text: newStickyPos.text || "",
                      color: [
                        "#FFEB3B",
                        "#FF9800",
                        "#E91E63",
                        "#4CAF50",
                        "#2196F3",
                      ][Math.floor(Math.random() * 5)],
                      z: 20,
                    };
                    addSticky(sticky);
                    setIsAddingSticky(false);
                    setNewStickyPos({ x: 100, y: 100 });
                  }}
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Save Whiteboard</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 rounded border mb-4 text-gray-900"
                placeholder="File name"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
                >
                  <Save size={14} /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved files sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-xl transform transition-transform z-40 ${
            showSavedSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Saved Whiteboards</h3>
              <p className="text-xs text-gray-400">Local storage & backend</p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 rounded bg-gray-700"
                onClick={() => {}}
              >
                Refresh
              </button>
              <button
                className="px-2 py-1 rounded bg-gray-700"
                onClick={() => setShowSavedSidebar(false)}
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-3 overflow-y-auto h-full space-y-3">
            {savedFiles.length === 0 ? (
              <div className="text-gray-400">No saved files yet</div>
            ) : (
              savedFiles.map((f) => (
                <div key={f.id} className="bg-gray-700 rounded p-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="truncate"
                      onClick={() => loadSavedFile(f)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-gray-400">{f.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadCombinedImage(f.name)}
                        className="px-2 py-1 rounded bg-green-600 text-xs"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => deleteSaved(f.id)}
                        className="px-2 py-1 rounded bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-600 rounded overflow-hidden">
                    <img
                      src={f.dataURL}
                      alt={f.name}
                      className="w-full h-28 object-cover"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
