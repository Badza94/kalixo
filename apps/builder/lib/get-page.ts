import { Data } from "@measured/puck";
import fs from "fs";
import path from "path";

// Replace with call to your database
export const getPage = (pagePath: string) => {
  // Try multiple possible locations for database.json
  const possiblePaths = [
    path.join(process.cwd(), "database.json"),
    path.join(process.cwd(), "apps", "builder", "database.json"),
    path.join(__dirname, "..", "database.json"),
    path.join(__dirname, "..", "..", "database.json"),
  ];

  let allData: Record<string, Data> | null = null;

  // Find the first existing database.json
  for (const testPath of possiblePaths) {
    console.log("Checking for database.json at:", testPath);
    if (fs.existsSync(testPath)) {
      console.log("✅ Found database.json at:", testPath);
      try {
        allData = JSON.parse(fs.readFileSync(testPath, "utf-8"));
        break;
      } catch (error) {
        console.error("Error reading database.json:", error);
      }
    }
  }

  if (!allData) {
    console.log("❌ No database found at any location");
    console.log("CWD:", process.cwd());
    console.log("__dirname:", __dirname);
    return null;
  }

  console.log("Available paths in database:", Object.keys(allData));
  console.log("Looking for path:", pagePath);

  const pageData = allData[pagePath];
  console.log("Found page data:", !!pageData);

  return pageData || null;
};
