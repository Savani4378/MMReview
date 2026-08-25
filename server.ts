import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI feature
  app.get("/api/generate-review", async (req, res) => {
    try {
      const prompt = `Generate a realistic fake review for a community event brand called 'Meet Mosaic'.
Return ONLY valid JSON matching this structure without any markdown backticks:
{
  "name": "Full Name",
  "whatsappNumber": "9876543210",
  "mailId": "email@example.com",
  "event": "Jamming",
  "overallRating": 5,
  "venueRating": 4,
  "activitiesRating": 5,
  "valueRating": 5,
  "interaction": "Yes, definitely",
  "returnIntent": "Definitely!",
  "recommendation": "Definitely",
  "liked": "The vibe was amazing and people were so friendly.",
  "improvement": "Maybe longer events.",
  "nextEvent": "Art & Craft",
  "testimonial": "I had a great time meeting new friends!",
  "testimonialPermission": "Yes"
}
Ensure whatsappNumber is 10 digits starting with 9. The event should be one of: 'Jamming', 'Art & Craft', or 'Social Gathering'.
`;
      const aiClient = getAI();
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
      });
      
      const text = response.text || "{}";
      // Clean up potential markdown formatting
      const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
      const data = JSON.parse(jsonStr);
      
      res.json(data);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate mock review" });
    }
  });

  app.post("/api/suggest-review", async (req, res) => {
    try {
      const { event, rating, field } = req.body;
      const aiClient = getAI();
      
      let prompt = "";
      const eventName = event || "a generic Meet Mosaic event";
      const starRating = rating || 5;

      if (field === 'liked') {
        prompt = `Write a short, natural 1-2 sentence feedback about what a customer liked most at the 'Meet Mosaic' event called '${eventName}'. They rated it ${starRating}/5 stars. Focus on community, atmosphere, or people. Do not use quotes.`;
      } else if (field === 'improvement') {
        prompt = `Write a short, natural 1-sentence constructive feedback on what could be improved at the 'Meet Mosaic' event called '${eventName}'. They rated it ${starRating}/5 stars. Keep it polite, helpful, and realistic. Do not use quotes.`;
      } else if (field === 'testimonial') {
        prompt = `Write a short, catchy 1-sentence testimonial for the 'Meet Mosaic' event called '${eventName}'. They rated it ${starRating}/5 stars. Do not use quotes.`;
      } else {
        return res.status(400).json({ error: "Invalid field" });
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
      });
      
      const text = response.text?.replace(/^["']|["']$/g, '').trim() || "";
      res.json({ suggestion: text });
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      res.status(500).json({ error: "Failed to generate suggestion" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
