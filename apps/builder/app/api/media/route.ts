import { NextResponse } from "next/server";
import { writeFile, readdir } from "fs/promises";
import { join } from "path";

// GET - List all images from public/shared
export async function GET() {
  try {
    const sharedDir = join(process.cwd(), "public", "shared");
    const files = await readdir(sharedDir);

    // Filter for image files
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const images = files
      .filter((file) =>
        imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
      )
      .map((file) => ({
        name: file,
        url: `/shared/${file}`,
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading media library:", error);
    return NextResponse.json(
      { error: "Failed to read media library" },
      { status: 500 }
    );
  }
}

// POST - Upload new image
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image." },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${safeName}`;

    // Write file to public/shared
    const filePath = join(process.cwd(), "public", "shared", filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/shared/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
