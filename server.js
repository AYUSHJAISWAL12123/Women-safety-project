import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { sendSOS } from "./sossender.js"; // Import the Twilio function

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

// ✅ Middleware (Apply these BEFORE defining routes)
app.use(cors());
app.use(express.json());

// ✅ API Endpoint: Send SOS Alert
app.post("/send-sos", (req, res) => {
    console.log("📩 Incoming SOS request:", req.body);

    if (!req.body || !req.body.location) {
        return res.status(400).json({ error: "❌ Location is required" });
    }

    sendSOS(req.body.location); // Call Twilio function
    res.json({ message: "✅ SOS Alert Sent!" });
});

// ✅ Test Route (Check if backend is running)
app.get("/", (req, res) => {
    res.send("🚀 Women Safety App Backend is Running!");
});

// ✅ WebSocket for SOS Alerts
io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    socket.on("sos-alert", (data) => {
        console.log("🚨 SOS Alert Received:", data);
        io.emit("alert-received", data);
    });

    socket.on("disconnect", () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
    });
});

// ✅ Start Server
server.listen(5000, () => console.log("🚀 Server running on port 5000"));
