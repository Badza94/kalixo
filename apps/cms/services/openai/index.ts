/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";

class OpenAiService {
  private apiKey: string;
  private client: OpenAI;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async productEnhancement(product: any) {
    const aiResponse = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Generate AI suggestions for product ${JSON.stringify(product, null, 2)}. The suggestions should include the following:
          1. Product title
          2. Product long description
          3. Product short description
          4. Product tags
          5. Product categories
          6. Product subcategories
          7, Product type
          
          Data needs to be returned in JSON format. The response should be a valid JSON object with the following structure:
          {
            "title": "string",
            "longDescription": "string",
            "shortDescription": "string",
            "tags": ["string"],
            "category": ["string"],
            "subCategories": ["string"],
            "productType": "string"
          }
          `,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = aiResponse?.choices[0]?.message?.content;
    const jsonResponse = content ? content.replace(/(\r\n|\n|\r)/gm, "") : "";
    const jsonData = JSON.parse(jsonResponse);
    const formattedResponse = {
      title: jsonData.title,
      longDescription: jsonData.longDescription,
      shortDescription: jsonData.shortDescription,
      tags: jsonData.tags,
      category: jsonData.category,
      subCategories: jsonData.subCategories,
      productType: jsonData.productType,
    };

    return formattedResponse;
  }
}

export const openAiService = new OpenAiService();
