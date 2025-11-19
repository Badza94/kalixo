import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
// import { getDefaultPages, isReadOnlyPage } from "../../../lib/default-pages"; // COMMENTED OUT

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
  let existingData = readDatabaseFile(databasePath);

  // COMMENTED OUT: Initialize default pages
  // const defaultPages = getDefaultPages();
  // let hasNewPages = false;
  
  // for (const [pagePath, pageData] of Object.entries(defaultPages)) {
  //   const existingPage = existingData[pagePath];
  //   // Add if doesn't exist, or update if it's a read-only page with minimal content (just heading)
  //   if (!existingPage) {
  //     existingData[pagePath] = pageData;
  //     hasNewPages = true;
  //   } else if (
  //     pagePath === "/login" ||
  //     pagePath === "/register" ||
  //     pagePath === "/checkout"
  //   ) {
  //     // Check if it's the old minimal structure (just a heading)
  //     const content = (existingPage as { content?: unknown[] })?.content || [];
  //     const hasOnlyHeading =
  //       Array.isArray(content) &&
  //       content.length === 1 &&
  //       (content[0] as { type?: string; props?: { items?: unknown[] } })?.type === "ContainerBlock" &&
  //       ((content[0] as { props?: { items?: unknown[] } })?.props?.items?.length === 1) &&
  //       ((content[0] as { props?: { items?: Array<{ content?: Array<{ type?: string }> }> } })?.props?.items?.[0]?.content?.[0]?.type === "HeadingBlock");
      
  //     if (hasOnlyHeading) {
  //       existingData[pagePath] = pageData;
  //       hasNewPages = true;
  //     }
  //   }
  // }

  // // Save default pages if any were added
  // if (hasNewPages) {
  //   writeDatabaseFile(databasePath, existingData);
  // }

  const paths = Object.keys(existingData).filter(
    (key) => !key.includes("_templates") && !key.includes("_global")
  );

  return NextResponse.json({ paths });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const databasePath = resolveDatabasePath();
  const existingData = readDatabaseFile(databasePath);

  // COMMENTED OUT: Prevent editing of read-only pages
  // if (isReadOnlyPage(payload.path)) {
  //   return NextResponse.json(
  //     { error: "This page cannot be edited" },
  //     { status: 403 }
  //   );
  // }

  // Ensure root.props.title is set if provided
  const dataToSave = payload.data;
  if (payload.title && dataToSave && typeof dataToSave === "object") {
    if (!dataToSave.root) {
      dataToSave.root = { props: {} };
    }
    if (!dataToSave.root.props) {
      dataToSave.root.props = {};
    }
    dataToSave.root.props.title = payload.title;
  }

  const updatedData = {
    ...existingData,
    [payload.path]: dataToSave,
  };

  writeDatabaseFile(databasePath, updatedData);

  // Purge Next.js cache
  revalidatePath(payload.path);

  return NextResponse.json({ status: "ok" });
}
