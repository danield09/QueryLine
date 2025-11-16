import { useEffect, useState } from "react";
import Split from "split.js";
import TableDirectory from "./components/TableDirectory";
import QueryHistory from "./components/QueryHistory";
import QueryEditor from "./components/QueryEditor";
import OutputWindow from "./components/OutputWindow";
import GeminiAI from "./components/GeminiAI";
import { initDatabase, executeQuery, getTables } from "./database/db";

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [tables, setTables] = useState([]);
  const [history, setHistory] = useState([]);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    // Initialize database
    async function setupDB() {
      await initDatabase();
      setDbReady(true);
      refreshTables();
    }
    setupDB();

    const terminalGutter = (i, direction) => {
      const g = document.createElement("div");
      g.className = `gutter gutter-${direction}`;
      g.style.backgroundColor = "#0f0";
      g.style.opacity = "0.3";
      g.style.cursor = direction === "vertical" ? "col-resize" : "row-resize";
      return g;
    };

    // Vertical split: left | main | Gemini
    Split(["#left-column", "#right-main", "#gemini-panel"], {
      sizes: [25, 50, 25],
      minSize: [20, 40, 20],
      gutterSize: 6,
      gutter: terminalGutter,
      cursor: "col-resize",
    });

    // Horizontal split for left column (top-left / bottom-left)
    Split(["#top-left", "#bottom-left"], {
      direction: "vertical",
      sizes: [50, 50],
      minSize: [20, 20],
      gutterSize: 6,
      gutter: terminalGutter,
      cursor: "row-resize",
    });

    // Horizontal split for main column (top-right / bottom-right)
    Split(["#top-right", "#bottom-right"], {
      direction: "vertical",
      sizes: [50, 50],
      minSize: [20, 20],
      gutterSize: 6,
      gutter: terminalGutter,
      cursor: "row-resize",
    });
  }, []);

  function refreshTables() {
    try {
      const allTables = getTables();
      setTables(allTables);
    } catch {
      setTables([]);
    }
  }

  function runQuery(sql) {
    if (!dbReady) {
      setOutput({ error: "Database not initialized yet." });
      return;
    }

    const result = executeQuery(sql);

    // Update output
    setOutput(result);

    // Update history (most recent at the top)
    setHistory((prev) => [{ sql, ...result }, ...prev]);

    // Refresh table list
    refreshTables();
  }

  return (
    <div id="root-container">
      {/* Left Column */}
      <div id="left-column" className="column">
        <div id="top-left" className="pane">
          <TableDirectory tables={tables} />
        </div>
        <div id="bottom-left" className="pane">
          <QueryHistory history={history} />
        </div>
      </div>

      {/* Main Column */}
      <div id="right-main" className="column">
        <div id="top-right" className="pane">
          <QueryEditor runQuery={runQuery} />
        </div>
        <div id="bottom-right" className="pane">
          <OutputWindow output={output} />
        </div>
      </div>

      {/* Gemini AI Panel */}
      <div id="gemini-panel" className="column">
        <GeminiAI />
      </div>
    </div>
  );
}

