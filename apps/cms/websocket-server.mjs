import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";
import http from "http";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE_PATH = path.join(__dirname, "logs", "app.log");

const server = http.createServer();
const wss = new WebSocketServer({ server });

function parseLogLine(line) {
  const match = line.match(/^(.+?) \[(\w+)\]: (.+)$/);
  if (!match) return null;

  const [, timestamp, rawType, message] = match;
  const type = rawType.toLowerCase(); // ERROR => error

  return { type, timestamp, message };
}

wss.on("connection", (ws) => {
  console.log("Client connected.");

  // ✅ Send all existing logs immediately
  const stream = fs.createReadStream(LOG_FILE_PATH, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream });

  rl.on("line", (line) => {
    const log = parseLogLine(line);
    if (log) ws.send(JSON.stringify(log));
  });

  rl.on("close", () => {
    console.log("Sent initial log history");
  });

  let lastSent = "";

  // ✅ Watch for new lines in the log file
  const tail = fs.watch(LOG_FILE_PATH, () => {
    const stream = fs.createReadStream(LOG_FILE_PATH, { encoding: "utf-8" });
    const rl = readline.createInterface({ input: stream });

    let lastLine = "";

    rl.on("line", (line) => {
      lastLine = line;
    });

    rl.on("close", () => {
      if (lastLine && lastLine !== lastSent) {
        const log = parseLogLine(lastLine);
        if (log) {
          ws.send(JSON.stringify(log));
          lastSent = lastLine;
        }
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
    tail.close();
  });
});

server.listen(3001, () => {
  console.log("WebSocket server running on ws://localhost:3001");
});
