# Product Card Block

A configurable product card component that displays product information with customizable buttons and styling.

## Features

- **Product Information Display**: Image, name, category, and price
- **Configurable Buttons**: Buy Now, Add to Cart, and Add to Favorites
- **Predefined Actions**: Built-in click handlers for e-commerce functionality
- **Flexible Layout**: Multiple button layouts (horizontal, vertical, icons-only)
- **Customizable Styling**: Background colors, border radius, spacing, and image aspect ratios
- **Responsive Design**: Adapts to different screen sizes

## Configuration Options

### Product Information

- **Product ID**: Unique identifier for the product (used in button actions)
- **Product Image**: Image source and alt text
- **Product Name**: Display name of the product
- **Category**: Product category (with color styling)
- **Price**: Product price with currency symbol
- **Currency Symbol**: Currency display (e.g., $, £, €)

### Display Options

- **Show Category**: Toggle category visibility
- **Show Price**: Toggle price visibility
- **Show Buttons**: Toggle all buttons visibility

### Button Layout

- **Horizontal**: Buttons arranged horizontally with Buy Now below
- **Vertical**: All buttons stacked vertically
- **Icons Only**: Only heart and cart icons displayed

### Button Customization

Each button (Buy Now, Add to Cart, Add to Favorites) can be individually customized:

#### Button Variants

- **Default**: Primary button style
- **Destructive**: Red/danger button style
- **Outline**: Outlined button style
- **Secondary**: Secondary button style
- **Ghost**: Transparent button style
- **Link**: Link-style button
- **Input**: Input field style
- **Text**: Text-only button

#### Button Sizes

- **Default**: Standard button size
- **Small**: Compact button size
- **Large**: Larger button size
- **Icon**: Icon-only button size

#### Button Colors

- **Background Color**: Custom background color for each button
- **Text Color**: Custom text color for each button
- **Theme Integration**: Colors integrate with the theme system

### Styling

- **Background Color**: Card background color
- **Border Radius**: Corner rounding
- **Margin**: External spacing
- **Padding**: Internal spacing
- **Image Aspect Ratio**: Image proportions (square, 4:3, 3:2, 16:9, custom)

## Predefined Actions

The component includes three predefined action functions that cannot be changed from the panel:

### `buyNow(id: string)`

- Triggered when "Buy Now" button is clicked
- Receives the product ID as parameter
- Should handle direct purchase flow

### `addFav(id: string)`

- Triggered when "Add to Favorites" button is clicked
- Receives the product ID as parameter
- Should handle adding product to user's favorites

### `addCart(id: string)`

- Triggered when "Add to Cart" button is clicked
- Receives the product ID as parameter
- Should handle adding product to shopping cart

## Default Configuration

```typescript
{
  productId: "product-1",
  image: {
    src: "/shared/placeholder.svg",
    alt: "Product image"
  },
  productName: "Xbox Gift Card £100",
  category: "Xbox",
  price: "100.00",
  currency: "£",
  showCategory: true,
  showPrice: true,
  showButtons: true,
  buttonLayout: "horizontal",
  imageAspectRatio: "square",
  borderRadius: { size: "lg" },
  padding: { all: "0" }
}
```

## Usage Examples

### Basic Product Card

```typescript
<ProductCardBlock
  productId="xbox-gift-card-100"
  productName="Xbox Gift Card £100"
  category="Gaming"
  price="100.00"
  currency="£"
  image={{
    src: "/images/xbox-gift-card.jpg",
    alt: "Xbox Gift Card £100"
  }}
/>
```

### Minimal Product Card (Icons Only)

```typescript
<ProductCardBlock
  productId="product-123"
  productName="Product Name"
  price="29.99"
  currency="$"
  buttonLayout="icons-only"
  showCategory={false}
/>
```

### Custom Styled Product Card

```typescript
<ProductCardBlock
  productId="premium-product"
  productName="Premium Product"
  category="Premium"
  price="199.99"
  currency="$"
  backgroundColor={{ colorKey: "primary" }}
  borderRadius={{ size: "2xl" }}
  imageAspectRatio="16/9"
  buttonLayout="vertical"
  buyNowButton={{
    variant: "default",
    size: "lg",
    backgroundColor: { colorKey: "destructive" },
    textColor: { colorKey: "white" }
  }}
  addToCartButton={{
    variant: "outline",
    size: "default",
    backgroundColor: { colorKey: "transparent" },
    textColor: { colorKey: "primary" }
  }}
  addToFavButton={{
    variant: "ghost",
    size: "sm",
    backgroundColor: { colorKey: "transparent" },
    textColor: { colorKey: "muted-foreground" }
  }}
/>
```

### Button Customization Examples

#### Purple Buy Now Button

```typescript
buyNowButton={{
  variant: "default",
  size: "default",
  backgroundColor: { customColor: "#8b5cf6" },
  textColor: { customColor: "#ffffff" }
}}
```

#### Red Add to Cart Button

```typescript
addToCartButton={{
  variant: "destructive",
  size: "sm",
  backgroundColor: { colorKey: "destructive" },
  textColor: { colorKey: "white" }
}}
```

#### Custom Heart Button

```typescript
addToFavButton={{
  variant: "ghost",
  size: "icon",
  backgroundColor: { customColor: "#fef2f2" },
  textColor: { customColor: "#dc2626" }
}}
```

## Integration with E-commerce

The ProductCardBlock is designed to integrate with your e-commerce system:

1. **Product Data**: Connect to your product database/API
2. **Action Handlers**: Implement the predefined functions to handle:
   - Direct purchases
   - Cart management
   - Wishlist/favorites
3. **Product Selection**: Allow users to select products by:
   - Individual product selection
   - Category filtering
   - Product type filtering

## Future Enhancements

- Product variant selection
- Quantity selector
- Product comparison
- Rating and review display
- Discount/sale price display
- Product availability status
- Quick view functionality

## Technical Notes

- Uses React.Fragment for optimal rendering
- Responsive design with Tailwind CSS
- TypeScript support with proper type definitions
- Integrates with theme system for consistent styling
- Optimized for performance with minimal re-renders
