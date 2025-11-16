import React from "react";
import "../index.css";

export default function OutputWindow({ output }) {
    if (!output) return <div className="output-window">No output yet.</div>;

    const { result, error } = output;

    if (error) {
        return <div className="output-window error">Error: {error}</div>;
    }

    if (!result || result.length === 0) {
        return <div className="output-window success">Query ran successfully.</div>;
    }

    // Only display first result set for simplicity
    const columns = result[0].columns;
    const values = result[0].values;

    return (
        <div className="output-window">
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {values.map((row, i) => (
                        <tr key={i}>
                            {row.map((val, j) => (
                                <td key={j}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



