/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export function useCartProductInputs(cart: any[]) {
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [customPrices, setCustomPrices] = useState<Record<number, number>>({});
  const [quantities, setQuantities] = useState<Record<number, string>>({});

  // Calculate subtotal for a product
  const calculateSubtotal = (product: any): number => {
    const quantity = quantities[product.id] || 1;
    const cartPrice =
      product.denominationType === "open"
        ? (customPrices as any)[product.id] / 100 ||
          product.denominationDefaultValue / 100
        : Number.parseFloat(product.cartPrice) / 100;
    return Number(quantity) * cartPrice;
  };

  const getDisplayPrice = (product: any): string => {
    if (priceInputs[product.id] !== undefined) {
      return priceInputs[product.id] ?? "";
    }
    if (product.denominationType === "open") {
      return (
        (customPrices as any)[product.id] / 100 ||
        product.denominationDefaultValue / 100
      ).toString();
    } else {
      return product.cartPrice;
    }
  };

  const handlePriceInputChange = (product: any, value: string) => {
    const regex = product.denominationAllowDecimal
      ? /^\d*([.,]\d{0,2})?$/
      : /^\d*$/;
    value = value.replace(",", ".");
    if (!regex.test(value)) {
      return;
    }
    setCustomPrices((prev) => ({ ...prev, [product.id]: Number(value) * 100 }));
    setPriceInputs((prev) => ({ ...prev, [product.id]: value }));
  };

  const handlePriceBlur = (product: any) => {
    const inputValue = priceInputs[product.id] || "";
    let cartPrice = Number.parseFloat(inputValue.replace(",", "."));
    if (isNaN(cartPrice) || inputValue === "") {
      cartPrice = product.denominationDefaultValue / 100;
    } else {
      if (cartPrice < product.denominationMinValue / 100) {
        cartPrice = product.denominationMinValue / 100;
      } else if (cartPrice > product.denominationMaxValue / 100) {
        cartPrice = product.denominationMaxValue / 100;
      }
      if (!product.denominationAllowDecimal) {
        cartPrice = Math.floor(cartPrice);
      }
    }
    setCustomPrices((prev) => ({ ...prev, [product.id]: cartPrice * 100 }));
    setPriceInputs((prev) => ({ ...prev, [product.id]: cartPrice.toString() }));
  };

  useEffect(() => {
    const newQuantities: Record<number, string> = {};
    cart.forEach((item: any) => {
      newQuantities[item.id] = item.quantity.toString();
    });
    setQuantities((prev) => ({ ...prev, ...newQuantities }));

    setPriceInputs((prev) => {
      const newPriceInputs: Record<number, string> = {};
      cart.forEach((item: any) => {
        newPriceInputs[item.id] = (item.cartPrice / 100).toString();
      });
      return { ...prev, ...newPriceInputs };
    });
    setCustomPrices((prev) => {
      const newCustomPrices: Record<number, number> = {};
      cart.forEach((item: any) => {
        newCustomPrices[item.id] = item.cartPrice;
      });
      return { ...prev, ...newCustomPrices };
    });
  }, [cart]);

  const incrementQuantity = (productId: number) => {
    setQuantities((prev) => {
      const currentQuantity = Number(prev[productId] || 1);

      return {
        ...prev,
        [productId]: (currentQuantity + 1).toString(),
      };
    });
  };
  const decrementQuantity = (productId: number) => {
    setQuantities((prev) => {
      const currentQuantity = Number(prev[productId] || 1);
      if (currentQuantity > 1) {
        return {
          ...prev,
          [productId]: (currentQuantity - 1).toString(),
        };
      }
      return prev; // Don't allow quantity to go below 1
    });
  };

  return {
    priceInputs,
    setPriceInputs,
    customPrices,
    setCustomPrices,
    quantities,
    setQuantities,
    calculateSubtotal,
    getDisplayPrice,
    handlePriceInputChange,
    handlePriceBlur,
    incrementQuantity,
    decrementQuantity,
  };
}
