import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATABASE_SEARCH_PATHS = [
  path.join(process.cwd(), "database.json"),
  path.join(process.cwd(), "apps", "builder", "database.json"),
];

const resolveDatabasePath = () => {
  for (const candidate of DATABASE_SEARCH_PATHS) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return DATABASE_SEARCH_PATHS[0];
};

const readDatabaseFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    return {} as Record<string, unknown>;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    if (!content) {
      return {} as Record<string, unknown>;
    }

    const parsed = JSON.parse(content);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {} as Record<string, unknown>;
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    console.error("Failed to read database.json:", error);
    return {} as Record<string, unknown>;
  }
};

const writeDatabaseFile = (filePath: string, data: Record<string, unknown>) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data));
};

export async function GET() {
  const databasePath = resolveDatabasePath();
  const existingData = readDatabaseFile(databasePath);

  const globals = existingData._global || { header: [], footer: [] };

  return NextResponse.json({ globals });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const databasePath = resolveDatabasePath();
  const existingData = readDatabaseFile(databasePath);

  const updatedData = {
    ...existingData,
    _global: payload.globals,
  };

  writeDatabaseFile(databasePath, updatedData);

  return NextResponse.json({ status: "ok" });
}

