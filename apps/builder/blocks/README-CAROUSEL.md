# Enhanced Carousel Block Component

## Overview

The Enhanced Carousel Block is a flexible, drag-and-drop component for the Puck builder that allows users to create image carousels, content sliders, and more with **grid layouts**.

## Features

### Core Functionality

- ✅ **Multiple Items**: Add unlimited carousel items
- ✅ **Items Per Slide**: Show 1-6 items per slide (grid layout)
- ✅ **Multiple Components Per Item**: Add multiple components (Image, Text, Button, etc.) directly to each item!
- ✅ **No Flex Required**: Components automatically stack vertically - no need to wrap in Flex/Container blocks
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Navigation Controls**: Optional previous/next navigation buttons
- ✅ **Keyboard Support**: Navigate with arrow keys

### Configuration Options

#### Layout

- **Items Per Slide**: Choose how many items to show per slide (1, 2, 3, 4, 5, or 6)
- **Orientation**: Horizontal or Vertical carousel
- **Gap**: Spacing between carousel slides (none, sm, md, lg, xl)
- **Item Gap**: Spacing between components within each item (none, sm, md, lg, xl)
- **Item Min Height**: Set minimum height for carousel items (e.g., 300px, 400px)
- **Item Padding**: Inner padding for each carousel item

#### Navigation

- **Show Navigation**: Toggle previous/next navigation buttons
- **Loop**: Enable/disable infinite looping

#### Styling

- **Container Background Color**: Set background color for the entire carousel
- **Item Background Color**: Set background color for individual carousel items
- **Border Radius**: Apply rounded corners to the carousel
- **Margin**: Set outer spacing
- **Padding**: Set container padding

## How to Use

### Adding a Carousel

1. In the Puck builder, find "Carousel" in the **Components** category
2. Drag it onto your page
3. By default, it comes with 6 items arranged in a **3-items-per-slide grid**
4. You'll see a visual grid where you can drag and drop components

### Adding Content to Carousel Items (EASY!)

1. Click on the carousel to select it
2. In the right sidebar, you'll see **"Items Per Slide"** - choose 1-6 items per slide
3. Scroll down to the **Items** section - you'll see a grid of items
4. Click on any item (e.g., "Item 1") to expand it
5. You'll see a **Contents** array - this is where you add components
6. Click **+** to add components to the item:
   - Add an Image Block
   - Add a Heading Block
   - Add a Text Block
   - Add a Button Block
   - Add ANY block component!
7. Components automatically stack vertically - no Flex block needed!

### Adding More Items

1. Select the carousel
2. In the **Items** section, click the **+** button next to "Items" to add more items
3. Each new item starts with one empty component slot
4. Reorder items by dragging them in the items list
5. **Items are automatically grouped into slides** based on your "Items Per Slide" setting

### Example Use Cases

#### Simple Image Gallery (3 items per slide)

```
Carousel (Items Per Slide: 3)
  ├─ Slide 1:
  │   ├─ Item 1: Image Block
  │   ├─ Item 2: Image Block
  │   └─ Item 3: Image Block
  └─ Slide 2:
      ├─ Item 4: Image Block
      ├─ Item 5: Image Block
      └─ Item 6: Image Block
```

#### Product Showcase (2 items per slide)

```
Carousel (Items Per Slide: 2)
  ├─ Slide 1:
  │   ├─ Item 1:
  │   │   ├─ Image Block (product photo)
  │   │   ├─ Heading Block ("Product Name")
  │   │   ├─ Text Block ("Description")
  │   │   └─ Button Block ("Buy Now")
  │   └─ Item 2: [Same structure]
  └─ Slide 2:
      ├─ Item 3: [Same structure]
      └─ Item 4: [Same structure]
```

#### Testimonial Slider (1 item per slide)

```
Carousel (Items Per Slide: 1)
  ├─ Slide 1:
  │   └─ Item 1:
  │       ├─ Text Block (quote)
  │       ├─ Heading Block (author name)
  │       └─ Text Block (author title)
  ├─ Slide 2: [Same structure]
  └─ Slide 3: [Same structure]
```

#### Feature Highlights (4 items per slide)

```
Carousel (Items Per Slide: 4)
  ├─ Slide 1:
  │   ├─ Item 1: [Icon + Heading + Text]
  │   ├─ Item 2: [Icon + Heading + Text]
  │   ├─ Item 3: [Icon + Heading + Text]
  │   └─ Item 4: [Icon + Heading + Text]
  └─ Slide 2: [More items...]
```

## Technical Details

### Built With

- **shadcn/ui Carousel**: Uses the shadcn carousel component
- **Embla Carousel**: Powered by embla-carousel-react
- **Puck Builder**: Integrated with Puck's slot system for drag-and-drop

### Component Location

- Block Component: `/apps/builder/blocks/carousel-block.tsx`
- Configuration: `/apps/builder/puck.config.tsx`

### Default Props

```typescript
{
  itemsPerSlide: 3,    // Show 3 items per slide (grid layout)
  orientation: "horizontal",
  showNavigation: true,
  loop: true,
  gap: "md",           // Gap between slides
  itemGap: "md",       // Gap between components within an item
  itemMinHeight: "300px",
  itemPadding: { all: "16px" },
  items: [
    { contents: [{ content: null }] },  // 6 items total
    { contents: [{ content: null }] },  // Will create 2 slides (3 items each)
    { contents: [{ content: null }] },
    { contents: [{ content: null }] },
    { contents: [{ content: null }] },
    { contents: [{ content: null }] }
  ]
}
```

## Tips & Best Practices

1. **Choose Items Per Slide Wisely**:
   - 1 item = Full-width content (testimonials, hero images)
   - 2-3 items = Product showcases, feature highlights
   - 4-6 items = Image galleries, icon grids

2. **Multiple Components Per Item**: Each item can contain multiple components - just click + to add more!

3. **Set Appropriate Height**: Adjust `itemMinHeight` based on your content to ensure consistent item heights

4. **Control Spacing**:
   - Use **Gap** to control spacing between slides
   - Use **Item Gap** to control spacing between components within an item
   - Use **Item Padding** to add breathing room inside each item

5. **Maintain Consistency**: Keep similar content structure across items for better UX

6. **Mobile Consideration**: Test on mobile - fewer items per slide work better on small screens

7. **Image Optimization**: Use appropriately sized images for better performance

8. **Easy Stacking**: Components automatically stack vertically in each item - no need for Flex blocks!

9. **Visual Hierarchy**: Use heading sizes and text colors to create clear visual hierarchy within items

## New Features in This Version

✅ **Grid Layout**: Items are arranged in a grid within each slide  
✅ **Items Per Slide Control**: Choose 1-6 items per slide  
✅ **Automatic Grouping**: Items are automatically grouped into slides  
✅ **Visual Grid Preview**: See the grid layout in the builder  
✅ **Better Defaults**: Starts with 6 items in a 3x2 grid

## Future Enhancements

- Autoplay functionality (requires embla autoplay plugin)
- Thumbnail navigation
- Progress indicators
- Custom animation timings
- Touch/swipe gestures customization
- Responsive items per slide (different counts for mobile/desktop)
