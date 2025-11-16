import initSqlJs from "sql.js";

let db = null;

// Check if DB is initialized
export function isDBReady() {
    return db !== null;
}

export async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/${file}`,
    });

    // Load saved DB from localStorage if exists
    const saved = localStorage.getItem("sqlDB");

    if (saved) {
        const uint8Array = new Uint8Array(JSON.parse(saved));
        db = new SQL.Database(uint8Array);
    } else {
        db = new SQL.Database();
    }

    return db;
}

// Save DB state every time user executes queries
export function saveDatabase() {
    if (!db) return;
    const data = db.export();
    localStorage.setItem("sqlDB", JSON.stringify(Array.from(data)));
}

export function executeQuery(sql) {
    if (!db) return { error: "Database not initialized yet." };

    try {
        const result = db.exec(sql);
        saveDatabase(); // persist after modifying DB
        return { result };
    } catch (err) {
        return { error: err.message };
    }
}

export function getTables() {
    if (!db) return [];  // ← prevents crash if called early

    const res = db.exec(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
    );

    return res[0] ? res[0].values.map((t) => t[0]) : [];
}

export function getTableColumns(table) {
    if (!db) return [];

    const res = db.exec(`PRAGMA table_info(${table});`);
    return res[0]?.values || [];
}