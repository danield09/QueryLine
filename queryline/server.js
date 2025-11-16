import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({}); // SDK reads GOOGLE_APPLICATION_CREDENTIALS

app.post("/api/gemini", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer briefly and in plain text only: ${prompt}`,
        });

        // Ensure only plain text is sent
        const plainText = response.text.replace(/<\/?[^>]+(>|$)/g, ""); // strip any HTML tags if present
        res.json({ text: plainText.trim() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reach Gemini API" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
