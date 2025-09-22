/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { openAiService } from "..";

export async function getProductEnhancementAction(product: any) {
  const response = await openAiService.productEnhancement(product);
  return response;
}
