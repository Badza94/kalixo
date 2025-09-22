import ProductForm from "@/components/products/forms/product";
import currencies from "@/data/currencies.json";
import product from "@/data/singleProductData.json";
import countries from "@/data/countries.json";
import brands from "@/data/brands.json";
import productTypes from "@/data/productTypesFilters.json";
import { notFound } from "next/navigation";

async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  return (
    <div>
      <ProductForm
        id={id}
        currencies={currencies}
        countries={countries}
        brands={brands}
        productTypes={productTypes}
        product={id === "create" ? undefined : product}
      />
    </div>
  );
}

export default SingleProductPage;
