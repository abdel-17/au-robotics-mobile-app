import "dotenv/config";
import * as v from "valibot";
import { WebSocketServer } from "ws";

const host = process.env.HOST || "localhost";
const port = Number(process.env.PORT || 8080);
const wss = new WebSocketServer({ host, port });

const CoordinatesSchema = v.object({
    latitude: v.number(),
    longitude: v.number(),
});

wss.on("listening", () => {
    console.log(`Server is listening on ${host}:${port}`);
});

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("error", console.error);

    ws.on("message", (data) => {
        if (Array.isArray(data)) {
            return;
        }

        const text = new TextDecoder().decode(data);
        const coordinates = v.safeParse(CoordinatesSchema, JSON.parse(text));
        if (!coordinates.success) {
            return;
        }

        const { latitude, longitude } = coordinates.output;
        console.log("Location: (%s %s)", latitude, longitude);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
