# Pagination in Page Builder

This guide explains how pagination works in the Kalixo page builder system and how to use it on category pages.

## The Challenge

In a page builder system where users can freely design pages and add blocks anywhere (filters, banners, product grids, etc.), implementing pagination is challenging because:

1. **Flexible Layout**: Users can place blocks anywhere on the page
2. **Multiple Grids**: A page might have multiple product grids
3. **Dynamic Content**: Products are filtered based on user selections
4. **URL State**: Filters and pagination need to sync via URL parameters

## The Solution: Paginated Product Grid Block

We've created a **self-contained** `PaginatedProductGridBlock` that handles everything automatically:

- ✅ Reads products from data
- ✅ Applies filters from URL (syncs with `CategoryFiltersBlock`)
- ✅ Handles sorting
- ✅ Paginates results
- ✅ Shows pagination controls
- ✅ Updates URL on page changes
- ✅ Resets to page 1 when filters change

## How It Works

### 1. **URL-Based State Management**

The block uses URL parameters to maintain state:

```
/category/electronics?types=Laptop,Phone&brands=Apple&sort=price-low-high&page=2
```

**Parameters:**
- `types`: Product types (comma-separated)
- `brands`: Brands (comma-separated)
- `platforms`: Platforms (comma-separated)
- `priceMin`: Minimum price
- `priceMax`: Maximum price
- `sort`: Sort option (price-low-high, price-high-low, name-a-z, name-z-a)
- `page`: Current page number

### 2. **Automatic Synchronization**

The `PaginatedProductGridBlock` automatically syncs with the `CategoryFiltersBlock`:

```tsx
// CategoryFiltersBlock updates URL
updateURL({ types: ['Laptop'], brands: ['Apple'] })

// PaginatedProductGridBlock reads from URL
const urlFilters = useMemo(() => {
  const types = searchParams.get("types")?.split(",") || [];
  const brands = searchParams.get("brands")?.split(",") || [];
  // ...
}, [searchParams]);
```

### 3. **Client-Side Filtering & Pagination**

Products are filtered, sorted, and paginated on the client:

```tsx
const { filteredProducts, totalPages, paginatedProducts } = useMemo(() => {
  let products = productsData;
  
  // Apply filters
  if (urlFilters.types) {
    products = products.filter(p => urlFilters.types.includes(p.type));
  }
  
  // Apply sorting
  products = sortProducts(products, sortOption);
  
  // Paginate
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = products.slice(startIndex, startIndex + itemsPerPage);
  
  return { filteredProducts, totalPages, paginatedProducts };
}, [urlFilters, sortOption, currentPage, itemsPerPage]);
```

## Usage Guide

### Building a Category Page

1. **Add Category Filters Block** (optional but recommended)
   - Drag the `CategoryFiltersBlock` to your page
   - Configure filter options and styling
   - This will update URL parameters

2. **Add Paginated Product Grid Block**
   - Drag the `PaginatedProductGridBlock` below your filters
   - Configure display options:
     - **Items per page**: How many products per page (default: 12)
     - **Show Pagination**: Toggle pagination controls
     - **Sync with Filters**: Enable/disable filter synchronization
     - **Default Category**: Optionally filter by a specific category
     - **Grid Columns**: 1-6 columns
     - Visual settings (colors, spacing, etc.)

3. **Add Other Content** (optional)
   - Add banners, text, images anywhere on the page
   - The pagination will work regardless of page layout

### Configuration Options

#### Pagination Settings

```tsx
{
  itemsPerPage: 12,           // Products per page
  showPagination: true,        // Show/hide pagination
  syncWithFilters: true,       // Sync with CategoryFiltersBlock
  defaultCategory: "Electronics" // Optional category filter
}
```

#### Display Options

All the same options as `ProductGridBlock`:
- Grid columns (1-6)
- Show/hide category, price, buttons
- Button layouts (horizontal, vertical, icons-only)
- Styling (colors, spacing, borders, etc.)

## Example Page Structure

Here's a typical category page structure:

```
┌─────────────────────────────────────┐
│  Navigation Block                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Heading Block                       │
│  "Shop Electronics"                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Category Filters Block              │
│  [Filters Button] [Sort Dropdown]   │
│  [Active Filter Badges]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Image/Banner Block (optional)       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Paginated Product Grid Block        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ P1 │ │ P2 │ │ P3 │ │ P4 │       │
│  └────┘ └────┘ └────┘ └────┘       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ P5 │ │ P6 │ │ P7 │ │ P8 │       │
│  └────┘ └────┘ └────┘ └────┘       │
│                                      │
│  [← 1 2 3 ... 10 →]                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Rich Text Block (optional)          │
│  Additional content                  │
└─────────────────────────────────────┘
```

## Advanced Use Cases

### 1. Multiple Category Pages

Create different category pages with specific filters:

**Electronics Page:**
```tsx
{
  defaultCategory: "Electronics",
  syncWithFilters: true
}
```

**Accessories Page:**
```tsx
{
  defaultCategory: "Accessories", 
  syncWithFilters: true
}
```

### 2. Featured Products Grid (No Pagination)

For homepage or featured sections:

```tsx
{
  itemsPerPage: 8,
  showPagination: false,
  syncWithFilters: false,
  defaultCategory: "Featured"
}
```

### 3. All Products Page

Show all products with filters and pagination:

```tsx
{
  itemsPerPage: 24,
  showPagination: true,
  syncWithFilters: true
  // No defaultCategory - shows all products
}
```

## Comparison: ProductGridBlock vs PaginatedProductGridBlock

| Feature | ProductGridBlock | PaginatedProductGridBlock |
|---------|------------------|---------------------------|
| **Product Selection** | Manual selection or filters | Automatic (all products) |
| **Pagination** | ❌ No | ✅ Yes |
| **Filter Sync** | ❌ No | ✅ Yes (optional) |
| **URL Integration** | ❌ No | ✅ Yes |
| **Best For** | - Homepage<br>- Handpicked collections<br>- Fixed product sets | - Category pages<br>- Search results<br>- Large product catalogs |
| **Max Products** | Limited (set in config) | Unlimited (paginated) |

## Technical Architecture

### Component Hierarchy

```
PaginatedProductGridBlock
├── useMemo: Filter & Sort Logic
├── useMemo: Pagination Calculation
├── useEffect: Page Reset on Filter Change
└── Render:
    ├── Results Summary
    ├── Product Grid
    └── Pagination Controls
```

### Data Flow

```
User Interaction
     ↓
CategoryFiltersBlock
     ↓
URL Parameters Updated
     ↓
PaginatedProductGridBlock Reads URL
     ↓
Filter & Sort Products
     ↓
Calculate Pagination
     ↓
Display Current Page
     ↓
User Clicks Page Number
     ↓
Update URL & Re-render
```

### Performance Considerations

1. **Memoization**: Heavy computations are memoized
2. **Client-Side**: All filtering/sorting happens in browser (fast for < 10k products)
3. **URL-Based**: State persists across refreshes and is shareable

## Future Enhancements

Potential improvements for larger datasets:

1. **Server-Side Pagination**: Fetch only current page from API
2. **Infinite Scroll**: Alternative to traditional pagination
3. **Virtual Scrolling**: For very large datasets
4. **Load More Button**: Progressive loading option

## Troubleshooting

### Pagination not showing

- Check `showPagination` is set to `true`
- Ensure you have more products than `itemsPerPage`

### Filters not working

- Check `syncWithFilters` is set to `true`
- Ensure `CategoryFiltersBlock` is on the same page
- Verify URL parameters are being updated

### Products not displaying

- Check product data in `productsData.json`
- Verify `defaultCategory` matches your product categories
- Check browser console for errors

### Page resets to 1 unexpectedly

- This is intentional when filters change
- Ensures users don't land on empty pages after filtering

## Summary

The `PaginatedProductGridBlock` solves the pagination challenge in a page builder by:

1. **Being self-contained**: No manual pagination placement needed
2. **Using URL state**: Works with browser history and is shareable
3. **Syncing automatically**: Integrates with filters seamlessly
4. **Being flexible**: Works anywhere on any page layout

This approach gives users maximum flexibility while providing a robust, user-friendly pagination experience.

