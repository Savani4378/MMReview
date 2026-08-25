import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    // Allow fallback to GEMINI_API_KEY if the user placed it there
    const key = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    openaiClient = new OpenAI({
      apiKey: key,
    });
  }
  return openaiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers middleware
  app.use((_req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://api.openai.com https:; frame-ancestors 'self' https://ai.studio https://*.google.com https://*.run.app; base-uri 'self'; form-action 'self';"
    );
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Allow requests from the deployed Netlify admin panel
  app.use(cors({
    origin: ['https://meetmosaicreviews.netlify.app', 'http://localhost:3000'],
    credentials: true
  }));

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
      const aiClient = getOpenAI();
      const response = await aiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      });
      
      const text = response.choices[0].message.content || "{}";
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
      const aiClient = getOpenAI();
      
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

      const response = await aiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      });
      
      const text = response.choices[0].message.content?.replace(/^["']|["']$/g, '').trim() || "";
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
