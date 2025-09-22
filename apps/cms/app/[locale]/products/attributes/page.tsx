import PageTitle from "@/components/page-title";
import BrandTable from "@/components/products/tables/brand";
import CategoryTable from "@/components/products/tables/categories";
import ProductTypeTable from "@/components/products/tables/product-type";
import PlatformTable from "@/components/products/tables/platforms";

import brands from "@/data/brands.json";
import productTypes from "@/data/productTypes.json";
import categories from "@/data/categories.json";
import platforms from "@/data/platforms.json";

function Attributes() {
  return (
    <div className="space-y-4">
      <PageTitle
        title="Product Attributes"
        description="Manage brands, product types, platforms, and categories for your products"
      />
      <BrandTable brands={brands} />

      <ProductTypeTable productTypes={productTypes} />

      <PlatformTable platforms={platforms} />

      <CategoryTable categories={categories} />
    </div>
  );
}

export default Attributes;
