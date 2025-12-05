# URL-Based Brand Filtering

## 🎯 How It Works Now

The `PaginatedProductGridBlock` **automatically reads the brand from the URL path** and filters products accordingly. No manual configuration needed!

## 📍 URL Pattern

```
/category/[brand]
```

### Examples:

| URL | Brand Filter | Products Shown |
|-----|--------------|----------------|
| `/category/kalixo` | `Kalixo` | All Kalixo products |
| `/category/xbox` | `Xbox` | All Xbox products |
| `/category/playstation` | `PlayStation` | All PlayStation products |
| `/category/all-products` | `All-products` | All products (no brand filter) |

**Note:** The brand name in the URL is automatically capitalized to match your product data format.

## 🔍 How Filtering Works

### 1. **Brand Filtering (from URL path)**
   - Extracted automatically from `/category/[brand]`
   - Example: `/category/kalixo` → filters by `brand: "Kalixo"`

### 2. **Additional Filters (from URL query params)**
   - Added via `CategoryFiltersBlock`
   - Applied on top of brand filter
   - Parameters: `types`, `brands`, `platforms`, `priceMin`, `priceMax`, `sort`

### Complete Example:

```
URL: /category/kalixo?types=Digital&priceMin=50&sort=price-low-high
```

**Filters Applied:**
1. ✅ Brand: `Kalixo` (from URL path)
2. ✅ Type: `Digital` (from query param)
3. ✅ Min Price: `50` (from query param)
4. ✅ Sort: Price Low-High (from query param)

**Result:** Digital Kalixo products over $50, sorted by price

## 🎨 Page Structure

```tsx
// /category/kalixo page

<CategoryFiltersBlock />          // User applies filters
                                  // Updates URL query params

<PaginatedProductGridBlock        // Reads brand from path
  syncWithFilters={true}          // Syncs with filter params
  itemsPerPage={12}
  showPagination={true}
/>
```

## 💡 Benefits

### Before (Manual Props):
```tsx
// ❌ Had to manually set brand for each page
<PaginatedProductGridBlock
  defaultBrand="Kalixo"    // Manual configuration
  defaultCategory="Gaming" // More manual configuration
/>
```

### After (Automatic):
```tsx
// ✅ Automatically reads from URL
<PaginatedProductGridBlock
  syncWithFilters={true}   // That's it!
/>
```

## 🚀 Creating New Category Pages

### Option 1: Create in Pages.json

Just create a new page with the brand in the URL:

```json
"/category/steam": {
  "content": [
    {
      "type": "PaginatedProductGridBlock",
      "props": {
        "syncWithFilters": true,
        "itemsPerPage": 12
      }
    }
  ]
}
```

The page automatically filters for `brand: "Steam"` products!

### Option 2: Use Page Builder UI

1. Create new page: `/category/nintendo`
2. Add `PaginatedProductGridBlock`
3. Done! It automatically shows Nintendo products

## 📊 URL Query Parameters

These work automatically with `CategoryFiltersBlock`:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `types` | Product types (comma-separated) | `?types=Gaming,Digital` |
| `brands` | Additional brand filters | `?brands=Sony,Microsoft` |
| `platforms` | Gaming platforms | `?platforms=PS5,Xbox` |
| `priceMin` | Minimum price | `?priceMin=50` |
| `priceMax` | Maximum price | `?priceMax=100` |
| `sort` | Sort order | `?sort=price-low-high` |
| `page` | Page number | `?page=2` |

## 🔄 Dynamic Filtering Flow

```
User visits: /category/kalixo
     ↓
Component extracts "kalixo" from URL
     ↓
Capitalizes to "Kalixo"
     ↓
Filters products where brand === "Kalixo"
     ↓
User applies type filter → adds ?types=Digital
     ↓
Filters products where brand === "Kalixo" AND type === "Digital"
     ↓
User changes page → adds &page=2
     ↓
Shows products 13-24 of filtered results
```

## 🎯 Special Cases

### Show All Products (No Brand Filter)

If the URL segment after `/category/` is not a valid brand, it shows all products:

```
/category/all-products  → No brand filter (shows all)
/category/browse        → No brand filter (shows all)
```

### Case-Insensitive Matching

```
/category/kalixo     → Filters by "Kalixo"
/category/KALIXO     → Filters by "Kalixo"
/category/KaLiXo     → Filters by "Kalixo"
```

All variations work because we capitalize the first letter and keep the rest.

## 🛠 Technical Implementation

### Code Snippet:

```tsx
// Extract brand from URL path
const pathname = usePathname();
const brandFromUrl = useMemo(() => {
  const pathParts = pathname.split('/');
  const categoryIndex = pathParts.indexOf('category');
  if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
    const brand = pathParts[categoryIndex + 1];
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  }
  return null;
}, [pathname]);

// Filter products by brand
if (brandFromUrl) {
  products = products.filter((p) => p.brand === brandFromUrl);
}
```

## ✨ Summary

- **No manual configuration** needed per page
- **URL-driven** filtering (clean and RESTful)
- **Works with filters** from `CategoryFiltersBlock`
- **Pagination** works automatically
- **Shareable URLs** with all filters preserved

Just create pages with the pattern `/category/[brand]` and everything works automatically! 🎉

