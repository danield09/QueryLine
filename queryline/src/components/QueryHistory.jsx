import React from "react";

export default function QueryHistory({ history }) {
    return (
        <div className="query-history">
            {history.length === 0 && <div>No queries run yet.</div>}
            {history
                .slice() // shallow copy
                .reverse() // most recent first
                .map((item, idx) => (
                    <div key={idx} className="history-item">
                        <div>{item.sql}</div>
                        {item.error && <div>{item.error}</div>}
                        {item.result && !item.error && <div>Query ran successfully</div>}
                    </div>
                ))}
        </div>
    );
}
