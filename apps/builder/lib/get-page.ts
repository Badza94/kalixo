import { Data } from "@measured/puck";
import fs from "fs";
import path from "path";

interface GlobalComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  position: "header" | "footer";
}

interface PageData extends Data {
  root: Data["root"] & {
    props?: (Data["root"] extends { props?: infer P } ? P : object) & {
      excludeGlobals?: string[];
    };
  };
}

// Replace with call to your database
export const getPage = (
  pagePath: string
): (PageData & { dynamicSegment?: string }) | null => {
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
        const fileContent = fs.readFileSync(testPath, "utf-8").trim();

        // Handle empty file
        if (!fileContent) {
          console.log("⚠️ database.json is empty, returning empty data");
          allData = {};
          break;
        }

        allData = JSON.parse(fileContent);

        // Ensure allData is an object
        if (
          typeof allData !== "object" ||
          allData === null ||
          Array.isArray(allData)
        ) {
          console.log(
            "⚠️ database.json contains invalid data, treating as empty"
          );
          allData = {};
        }

        break;
      } catch (error) {
        console.error("Error reading database.json:", error);
        // If JSON is invalid, treat as empty
        allData = {};
        break;
      }
    }
  }

  if (!allData) {
    console.log("❌ No database found at any location");
    console.log("CWD:", process.cwd());
    console.log("__dirname:", __dirname);
    return null;
  }

  // remove the _templates from the existing paths
  const withoutTemplates = Object.keys(allData).filter(
    (value: string) => !value.includes("_templates")
  );
  allData = withoutTemplates.reduce(
    (acc, key) => {
      acc[key] = allData![key];
      return acc;
    },
    {} as Record<string, Data>
  );

  console.log("Available paths in database:", Object.keys(allData));
  console.log("Looking for path:", pagePath);

  // First, try exact match
  let pageData = allData[pagePath] as PageData | undefined;
  let dynamicSegment: string | undefined = undefined;

  // If no exact match, try dynamic route matching
  if (!pageData) {
    // Check if it's a category route: /category/[slug]
    if (pagePath.startsWith("/category/")) {
      const categoryTemplate = allData["/category"] as PageData | undefined;
      if (categoryTemplate) {
        console.log("Matched category template for:", pagePath);
        pageData = categoryTemplate;
        // Extract the slug (everything after /category/)
        dynamicSegment = pagePath.replace("/category/", "");
      }
    }
    // Check if it's a product route: /product/[permalink]
    else if (pagePath.startsWith("/product/")) {
      const productTemplate = allData["/product"] as PageData | undefined;
      if (productTemplate) {
        console.log("Matched product template for:", pagePath);
        pageData = productTemplate;
        // Extract the permalink (everything after /product/)
        dynamicSegment = pagePath.replace("/product/", "");
      }
    }
  }

  console.log("Found page data:", !!pageData);

  if (!pageData) {
    return null;
  }

  // Get global components
  const globals = allData._global as
    | { header?: GlobalComponent[]; footer?: GlobalComponent[] }
    | undefined;

  if (!globals || (!globals.header?.length && !globals.footer?.length)) {
    return pageData;
  }

  // Get excluded global component IDs for this page
  const excludedIds = new Set(pageData.root?.props?.excludeGlobals || []);

  // Clone the page data to avoid mutations
  const enhancedPageData: PageData = JSON.parse(JSON.stringify(pageData));

  if (!enhancedPageData.content) {
    enhancedPageData.content = [];
  }

  // Filter and prepend header components (that aren't excluded)
  const headerComponents = (globals.header || []).filter(
    (comp) => !excludedIds.has(comp.id)
  );

  // Filter and append footer components (that aren't excluded)
  const footerComponents = (globals.footer || []).filter(
    (comp) => !excludedIds.has(comp.id)
  );

  // Inject globals: headers at the start, footers at the end
  enhancedPageData.content = [
    ...headerComponents.map((comp) => ({ type: comp.type, props: comp.props })),
    ...enhancedPageData.content,
    ...footerComponents.map((comp) => ({ type: comp.type, props: comp.props })),
  ];

  // Add dynamic segment to root props if it exists
  if (dynamicSegment) {
    if (!enhancedPageData.root.props) {
      enhancedPageData.root.props = {};
    }
    (enhancedPageData.root.props as Record<string, unknown>).dynamicSegment =
      dynamicSegment;
  }

  return { ...enhancedPageData, dynamicSegment };
};
