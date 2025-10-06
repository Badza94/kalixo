import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// This would typically come from your database based on the shop/site ID
import THEME_CONFIG from "../../../themes.json";

export async function GET() {
  try {
    // In a real app, you'd fetch this from your database based on site/shop ID
    // const themeConfig = await getThemeFromDatabase(siteId);

    return NextResponse.json(THEME_CONFIG);
  } catch (error) {
    console.error("Error fetching theme config:", error);
    return NextResponse.json(
      { error: "Failed to fetch theme config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const themeConfig = await request.json();

    // Path to themes.json file
    const filePath = join(process.cwd(), "themes.json");

    // Write the updated theme config to the file
    await writeFile(filePath, JSON.stringify(themeConfig, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Theme configuration saved successfully",
    });
  } catch (error) {
    console.error("Error saving theme config:", error);
    return NextResponse.json(
      { error: "Failed to save theme config" },
      { status: 500 }
    );
  }
}
