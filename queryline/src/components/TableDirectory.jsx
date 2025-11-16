import React, { useState } from "react";
import { getTableColumns } from "../database/db";
import '../index.css';

export default function TableDirectory({ tables }) {
    const [expanded, setExpanded] = useState({}); // track expanded tables

    if (!tables || tables.length === 0) return <div>No tables</div>;

    const toggle = (table) => {
        setExpanded((prev) => ({ ...prev, [table]: !prev[table] }));
    };

    return (
        <div className="table-directory" style={{ fontFamily: "monospace", fontSize: "14px" }}>
            {tables.map((table) => (
                <div key={table}>
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => toggle(table)}
                    >
                        {expanded[table] ? "V" : ">"} {table}
                    </div>
                    {expanded[table] && (
                        <div style={{ paddingLeft: "16px" }}>
                            {getTableColumns(table).map(([cid, name, type]) => (
                                <div key={name}>
                                    {name} ({type})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
