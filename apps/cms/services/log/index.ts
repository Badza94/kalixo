import fs from "fs";
import path from "path";

// Define the types for the event types
export type EventType = "info" | "success" | "error" | "warn" | "api";

// Detect Vercel or other serverless environments
const isServerless = process.env.VERCEL === "1";

class LogService {
  private logFilePath: string;

  constructor() {
    this.logFilePath = path.join(process.cwd(), "logs", "app.log");

    if (!isServerless) {
      // Ensure the logs directory exists (local only)
      if (!fs.existsSync(path.dirname(this.logFilePath))) {
        fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
      }
    }
  }

  async logEvent(
    eventType: EventType,
    message?: string,
    stackTrace?: string,
    request?: string,
    response?: string
  ): Promise<void> {
    const timestamp = new Date().toISOString();

    let logEntry: string;

    if (eventType === "api") {
      logEntry = `{\n${timestamp} [${eventType.toUpperCase()}]: ${message} \n[request]: ${request}\n${timestamp} [response]: ${response}\n${stackTrace ? `${timestamp} [STACKTRACE]: ${stackTrace}\n` : ""}}\n`;
    } else {
      logEntry = `${timestamp} [${eventType.toUpperCase()}]: ${message}\n${stackTrace ? `${timestamp} [STACKTRACE]: ${stackTrace}\n` : ""}`;
    }

    if (!isServerless) {
      // ✅ Local/dev: write to file
      fs.appendFileSync(this.logFilePath, logEntry);
    } else {
      // ✅ Production/serverless: optionally log to remote/log API
      console.log("[Remote Log]", logEntry); // or send to remote endpoint
    }
  }
}

export const logService = new LogService();
