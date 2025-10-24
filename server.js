import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import { z } from "zod";
import express from "express"; // <-- Express import করুন

dotenv.config();

// create the MCP server (এই অংশ অপরিবর্তিত)
const server = new McpServer({
    name: "Sumit's Calendar",
    version: "1.0.0",
});

// tool function (এই অংশ অপরিবর্তিত)
async function getMyCalendarDataByDate(date) {
    const calendar = google.calendar({
        version: "v3",
        auth: process.env.GOOGLE_PUBLIC_API_KEY,
    });

    // Calculate the start and end of the given date (UTC)
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    try {
        const res = await calendar.events.list({
            calendarId: process.env.CALENDAR_ID,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = res.data.items || [];
        const meetings = events.map((event) => {
            const start = event.start.dateTime || event.start.date;
            return `${event.summary} at ${start}`;
        });

        if (meetings.length > 0) {
            return {
                meetings,
            };
        } else {
            return {
                meetings: [],
            };
        }
    } catch (err) {
        return {
            error: err.message,
        };
    }
}

// register the tool to MCP (এই অংশ অপরিবর্তিত)
server.tool(
    "getMyCalendarDataByDate",
    {
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format. Please provide a valid date string.",
        }),
    },
    async ({ date }) => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await getMyCalendarDataByDate(date)),
                },
            ],
        };
    }
);

// --- init() ফাংশনটি পরিবর্তন করুন ---
// set transport
async function init() {
    // চেক করুন TRANSPORT_MODE=http সেট করা আছে কি না
    if (process.env.TRANSPORT_MODE === "http") {
        // --- HTTP মোড (Vercel / ChatGPT-এর জন্য) ---
        console.log("Starting in HTTP mode...");
        const app = express();
        const port = process.env.PORT || 3000;
        
        const transport = new HttpServerTransport({
            app: app,
            path: "/mcp", // এই URL-এ আপনার MCP সার্ভারটি চলবে
        });
        await server.connect(transport);
        
        app.listen(port, () => {
            console.log(`MCP server listening at http://localhost:${port}/mcp`);
        });
        // Vercel-এর জন্য এটি দরকার
        return app; 

    } else {
        // --- Stdio মোড (Cursor-এর জন্য ডিফল্ট) ---
        console.log("Starting in Stdio mode for local Cursor...");
        const transport = new StdioServerTransport();
        await server.connect(transport);
        // Stdio মোডে app রিটার্ন করার দরকার নেই
        return null; 
    }
}

// call the initialization
const app = await init();

// Vercel-এর জন্য ডিফল্ট এক্সপোর্ট
export default app;