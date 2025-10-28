# Video Block

A versatile video block component that supports multiple video sources including uploaded videos, YouTube, and Vimeo.

## Features

- **Multiple Video Sources**:
  - Upload/URL: Direct video file URLs or uploaded videos
  - YouTube: Embed YouTube videos using video ID or full URL
  - Vimeo: Embed Vimeo videos using video ID or full URL

- **Customization Options**:
  - Aspect ratios (16:9, 4:3, 1:1, 21:9, custom, or auto)
  - Border radius controls
  - Shadow effects
  - Margin spacing
  - Max width settings

- **Video Controls**:
  - Show/hide playback controls
  - Autoplay
  - Loop
  - Muted
  - Poster image (thumbnail)

## Usage

### Upload/URL Type

1. Select "Upload / URL" as the type
2. Use the video file picker to upload a video or paste a direct video URL
3. Configure aspect ratio, controls, and styling options

### YouTube Type

1. Select "YouTube" as the type
2. Enter either:
   - Full YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
   - Video ID only (e.g., `dQw4w9WgXcQ`)
3. Configure playback options (autoplay, loop, muted, controls)
4. Style the video with aspect ratio and visual effects

### Vimeo Type

1. Select "Vimeo" as the type
2. Enter either:
   - Full Vimeo URL (e.g., `https://vimeo.com/123456789`)
   - Video ID only (e.g., `123456789`)
3. Configure playback and styling options

## Best Practices

1. **Aspect Ratio**: Use 16:9 for widescreen videos (most common)
2. **Autoplay**: Consider muting videos if using autoplay for better UX
3. **YouTube/Vimeo**: Ensure videos are public or properly configured for embedding
4. **File Uploads**: Use optimized video formats (MP4 is recommended) for faster loading

## Examples

### YouTube Video with Autoplay

```
Type: YouTube
YouTube ID: dQw4w9WgXcQ
Aspect Ratio: 16/9
Autoplay: Yes
Muted: Yes (recommended for autoplay)
Controls: Show
```

### Uploaded Video with Custom Styling

```
Type: Upload/URL
Video File: /videos/product-demo.mp4
Aspect Ratio: 16/9
Max Width: 800px
Border Radius: Large
Shadow: Medium
Controls: Show
Poster: /images/video-thumbnail.jpg
```

### Vimeo Video

```
Type: Vimeo
Vimeo ID: https://vimeo.com/123456789
Aspect Ratio: 16/9
Loop: Yes
Controls: Show
```

## Technical Notes

- YouTube and Vimeo videos are embedded using iframes
- Uploaded videos use the HTML5 `<video>` element
- Aspect ratio is maintained using the AspectRatio component
- URL extraction works automatically for both full URLs and video IDs
