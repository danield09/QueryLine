import React, { useState } from "react";
import "../index.css";

export default function QueryEditor({ runQuery }) {
  const [sql, setSql] = useState("");

  function execute() {
    if (typeof runQuery !== "function") return;
    runQuery(sql);
  }

  return (
    <div className="query-editor" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        className="query-textarea"
      />
      <button onClick={execute} className="query-run-button">
        Run
      </button>
    </div>
  );
}

