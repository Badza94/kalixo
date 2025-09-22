/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import productData from "@/data/singleProductData.json";
import { getProductEnhancementAction } from "@/services/openai/actions";

export const useProductAIEnhancement = (productId: string, open: boolean) => {
  const [product, setProduct] = useState<any>(null);
  const [aiSuggestions, setAISuggestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProductData();
    }
  }, [open]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      // for now we can import a dummy data
      const data = productData;

      setProduct(data);

      // Fetch AI suggestions
      const aiResponse = await getProductEnhancementAction(data);

      console.log("aiResponse: ", aiResponse);

      setAISuggestions(aiResponse);
    } catch (err) {
      console.error("AI Enhancement error:", err);
      setError("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  return { product, aiSuggestions, isLoading, error };
};
