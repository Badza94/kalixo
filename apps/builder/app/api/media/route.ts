import { NextResponse } from "next/server";
import { writeFile, readdir } from "fs/promises";
import { join } from "path";

// GET - List all media files from public/shared
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "image" or "video"

    const sharedDir = join(process.cwd(), "public", "shared");
    const files = await readdir(sharedDir);

    let mediaFiles: { name: string; url: string }[] = [];

    if (type === "video") {
      // Filter for video files
      const videoExtensions = [
        ".mp4",
        ".webm",
        ".ogg",
        ".avi",
        ".mov",
        ".wmv",
        ".flv",
        ".mkv",
      ];
      mediaFiles = files
        .filter((file) =>
          videoExtensions.some((ext) => file.toLowerCase().endsWith(ext))
        )
        .map((file) => ({
          name: file,
          url: `/shared/${file}`,
        }));
    } else {
      // Default to images (for backward compatibility)
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      mediaFiles = files
        .filter((file) =>
          imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
        )
        .map((file) => ({
          name: file,
          url: `/shared/${file}`,
        }));
    }

    return NextResponse.json({
      images: type !== "video" ? mediaFiles : [],
      videos: type === "video" ? mediaFiles : [],
    });
  } catch (error) {
    console.error("Error reading media library:", error);
    return NextResponse.json(
      { error: "Failed to read media library" },
      { status: 500 }
    );
  }
}

// POST - Upload new media file (image or video)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type for both images and videos
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    const validVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/mkv",
    ];

    const isValidImage = validImageTypes.includes(file.type);
    const isValidVideo = validVideoTypes.includes(file.type);

    if (!isValidImage && !isValidVideo) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image or video." },
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
      type: isValidImage ? "image" : "video",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
