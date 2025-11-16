import { useState } from "react";

export default function GeminiAI() {
    const [input, setInput] = useState("");
    const [pairs, setPairs] = useState([]); // store each user+AI pair as one object

    async function sendMessage() {
        if (!input) return;

        const userMessage = input;
        setInput(""); // clear input immediately

        // Add placeholder for AI while waiting
        const newPair = { user: userMessage, ai: "..." };
        setPairs(prev => [newPair, ...prev]);

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userMessage }),
            });

            const data = await res.json();

            // Update the latest pair with AI response
            setPairs(prev => {
                const updated = [...prev];
                updated[0] = { ...updated[0], ai: data.text };
                return updated;
            });

        } catch (err) {
            setPairs(prev => {
                const updated = [...prev];
                updated[0] = { ...updated[0], ai: "Error: " + err.message };
                return updated;
            });
        }
    }

    return (
        <div className="gemini-ai">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini..."
            />
            <button onClick={sendMessage}>Send</button>
            <div className="messages">
                {pairs.map((pair, i) => (
                    <div key={i} className="message-pair">
                        <div className="user-message">{"> "} {pair.user}</div>
                        <div className="ai-message">{"Gemini: "} {pair.ai}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

