/* eslint-disable @typescript-eslint/no-explicit-any */
import productsData from "@/data/productsData.json";
import companiesData from "@/data/companies.json";
import countriesData from "@/data/countries.json";
import currenciesData from "@/data/currencies.json";
import { supportedLocalesJson } from "@/data/supportedLocales";

export const downloadCsvTemplate = () => {
  const headers = [
    "name",
    "country_code",
    "flag",
    "currency_name",
    "currency_symbol",
    "currency_code",
    "number_format",
    "status",
    "languages",
    "language_codes",
    "vat_rate",
    "type",
    "region",
  ].join(";");

  const sampleData = [
    "United States",
    "US",
    "🇺🇸",
    "US Dollar",
    "$",
    "USD",
    "#,##0.00",
    "active",
    "English",
    "en",
    "0",
    "country",
    "",
  ].join(";");

  const csvContent = `${headers}\n${sampleData}`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "market_import_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadProductCsvTemplate = () => {
  const headers = [
    // Primary identifiers
    "id",
    "sku",
    "ean",

    // Basic product information
    "global_name",
    "local_name",
    "brand",
    "product_type",
    "category",
    "subcategory",
    "product_category",

    // Description fields
    "description",
    "short_description",
    "terms",
    "redemption_instructions",

    // Product details
    "publisher",
    "platform",
    "game",
    "genre",
    "version",
    "region",
    "edition",
    "package_type",
    "age_restriction",

    // Commercial information
    "rrp",
    "min_value",
    "max_value",
    "currency",
    "denomination",
    "pre_selected_denomination",

    // Links and redemption
    "linked_product_ids",
    "redemption_url",
    "redemption_url_code_format",

    // Media
    "new_image_product_id",

    // Tags and metadata
    "tags",
    "country_code",
    "language_code",

    // Status and expiry
    "status",
    "expiry_type",
    "expiry_date",

    // Dates
    "release_date",
    "onboarding_date",
  ].join(";");

  const csvContent = headers;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product_import_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadCustomersCsvTemplate = () => {
  const headers = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "street_address",
    "city",
    "postcode",
    "country",
    "date_of_birth",
    "status",
    "marketing_sms_opt_in",
    "marketing_email_opt_in",
    "default_channel",
  ].join(",");

  const sampleData = [
    "John",
    "Doe",
    "john.doe@example.com",
    "+1234567890",
    "123 Main St",
    "New York",
    "10001",
    "United States",
    "1990-01-01",
    "active",
    "true",
    "true",
    "kalixo",
  ].join(",");

  const csvContent = `${headers}\n${sampleData}`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "customers_import_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadOrdersCsvTemplate = () => {
  const headers = [
    "productId",
    "description (optional)",
    "brand (optional)",
    "quantity",
    "currency",
    "price (in cents)",
  ];

  const sampleData = [
    "12345",
    "Sample Product",
    "Sample Brand",
    "2",
    "USD",
    "1999",
  ].join(",");

  const csvContent = `${headers.join(",")}\n${sampleData}`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bulk_order_import_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadCompaniesCsvTemplate = () => {
  const headers = [
    "name",
    "legal_name",
    "website",
    "address",
    "country_code",
    "default_currency_code",
    "contact_name",
    "contact_email",
    "registration_number",
    "vat_number",
  ].join(";");

  const sampleData = [
    "Company 1",
    "Company 1",
    "https://www.company1.com",
    "123 Main St",
    "US",
    "USD",
    "John Doe",
    "john.doe@example.com",
    "1234567890",
    "1234567890",
  ].join(";");

  const csvContent = `${headers}\n${sampleData}`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "companies_import_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

type Product = {
  id: number;
  currencyCode: string;
  // other fields...
};

type ParsedItem = {
  productId: string;
  quantity: number;
  currency: string;
  price: number;
  product: any;
};

export const validatePlaceOrderCsv = async (
  file: File
): Promise<ParsedItem[]> => {
  const text = await file.text();
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const header = lines?.[0]?.split(",").map((h) => h.trim());
  const requiredFields = ["productId", "quantity", "currency"];

  if (!requiredFields.every((f) => header?.includes(f))) {
    throw new Error("CSV must have headers: productId, quantity, currency");
  }

  const result: ParsedItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowData = lines?.[i]?.split(",").map((col) => col.trim());
    if (rowData?.length !== header?.length) {
      console.warn(`Skipping row ${i + 1}: mismatched column count.`);
      continue;
    }

    const row: Record<string, string> = {};
    header?.forEach((key, index) => {
      (row as any)[key] = rowData?.[index];
    });

    const findPriceValue = (row: Record<string, string>): number => {
      // Try the exact expected header first
      if (row?.["price (in cents)"] !== undefined) {
        return Number(row["price (in cents)"]);
      }

      // Try common variations
      if (row?.["price"] !== undefined) {
        return Number(row["price"]);
      }

      // Try other potential variations
      const priceKeys = Object.keys(row).filter((key) =>
        key.toLowerCase().includes("price")
      );

      if (priceKeys.length > 0) {
        return Number(row[(priceKeys as any)?.[0]]);
      }

      return 1;
    };

    const productId = row?.["productId"];
    const quantity = Number(row["quantity"]);
    const currency = row["currency"];
    const price = findPriceValue(row);
    console.log("price: ", price);
    if (
      !productId ||
      isNaN(quantity) ||
      quantity <= 0 ||
      !currency ||
      isNaN(price) ||
      price <= 0
    ) {
      console.warn(`Skipping row ${i + 1}: invalid or missing data.`);
      continue;
    }

    const matchingProduct = productsData.find(
      (product: Product) =>
        product.id === Number(productId) && product.currencyCode === currency
    );

    if (!matchingProduct) {
      console.warn(
        `Skipping row ${i + 1}: productId + currency combination not found.`
      );
      continue;
    }

    result.push({
      productId,
      quantity,
      currency,
      price,
      product: matchingProduct,
    });
  }
  return result;
};

// Types for channel validation
type ParsedChannel = {
  name: string;
  channelType: string;
  description: string;
  companyId: string;
  domainType: "default" | "custom";
  customDomain?: string;
  defaultLocation: string;
  defaultCurrency: string;
  defaultLanguage: string;
  logoUrl?: string;
  iconUrl?: string;
  faviconUrl?: string;
  status: string;
};

const validChannelTypes = [
  "bulkOrdering",
  "firstParty",
  "whiteLabel",
  "marketplace",
  "marketing",
  "claim",
  "api",
  "custom",
];

const validStatuses = ["active", "inactive", "draft"];

export const validateChannelsCsv = async (
  file: File
): Promise<ParsedChannel[]> => {
  const text = await file.text();
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const header = lines?.[0]?.split(",").map((h) => h.trim());
  const requiredFields = [
    "name",
    "channel_type",
    "description",
    "company_id",
    "default_location",
    "default_currency",
    "default_language",
  ];

  if (!requiredFields.every((f) => header?.includes(f))) {
    throw new Error(`CSV must have headers: ${requiredFields.join(", ")}`);
  }

  const result: ParsedChannel[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowData = lines?.[i]?.split(",").map((col) => col.trim());
    if (rowData?.length !== header?.length) {
      console.warn(`Skipping row ${i + 1}: mismatched column count.`);
      continue;
    }

    const row: Record<string, string> = {};
    header?.forEach((key, index) => {
      (row as any)[key] = rowData?.[index];
    });

    const name = row["name"];
    const channelType = row["channel_type"];
    const description = row["description"];
    const companyId = row["company_id"];
    const domainType = (row["domain_type"] || "default") as
      | "default"
      | "custom";
    const customDomain = row["custom_domain"] || "";
    const defaultLocation = row["default_location"];
    const defaultCurrency = row["default_currency"];
    const defaultLanguage = row["default_language"];
    const logoUrl = row["logo_url"] || "";
    const iconUrl = row["icon_url"] || "";
    const faviconUrl = row["favicon_url"] || "";
    const status = row["status"] || "draft";

    // Validate required fields
    if (
      !name ||
      !channelType ||
      !description ||
      !companyId ||
      !defaultLocation ||
      !defaultCurrency ||
      !defaultLanguage
    ) {
      console.warn(`Skipping row ${i + 1}: missing required fields.`);
      continue;
    }

    // Validate channel type
    if (!validChannelTypes.includes(channelType)) {
      console.warn(
        `Skipping row ${i + 1}: invalid channel type '${channelType}'. Must be one of: ${validChannelTypes.join(", ")}`
      );
      continue;
    }

    // Validate company exists
    const matchingCompany = companiesData.find(
      (company: any) => company.id === companyId
    );
    if (!matchingCompany) {
      console.warn(
        `Skipping row ${i + 1}: company ID '${companyId}' not found.`
      );
      continue;
    }

    // Validate country exists
    const matchingCountry = countriesData.find(
      (country: any) => country.value === defaultLocation
    );
    if (!matchingCountry) {
      console.warn(
        `Skipping row ${i + 1}: country '${defaultLocation}' not found.`
      );
      continue;
    }

    // Validate currency exists
    const matchingCurrency = currenciesData.find(
      (currency: any) => currency.value === defaultCurrency
    );
    if (!matchingCurrency) {
      console.warn(
        `Skipping row ${i + 1}: currency '${defaultCurrency}' not found.`
      );
      continue;
    }

    // Validate language exists
    const matchingLanguage = supportedLocalesJson.find(
      (language: any) => language.locale === defaultLanguage
    );
    if (!matchingLanguage) {
      console.warn(
        `Skipping row ${i + 1}: language '${defaultLanguage}' not found.`
      );
      continue;
    }

    // Validate domain type and custom domain
    if (domainType === "custom" && !customDomain) {
      console.warn(
        `Skipping row ${i + 1}: custom domain is required when domain_type is 'custom'.`
      );
      continue;
    }

    // Validate status
    if (!validStatuses.includes(status)) {
      console.warn(
        `Skipping row ${i + 1}: invalid status '${status}'. Must be one of: ${validStatuses.join(", ")}`
      );
      continue;
    }

    result.push({
      name,
      channelType,
      description,
      companyId,
      domainType,
      customDomain: domainType === "custom" ? customDomain : undefined,
      defaultLocation,
      defaultCurrency,
      defaultLanguage,
      logoUrl: logoUrl || undefined,
      iconUrl: iconUrl || undefined,
      faviconUrl: faviconUrl || undefined,
      status,
    });
  }
  return result;
};

export const downloadChannelsCsvTemplate = () => {
  const headers = [
    "name",
    "channel_type",
    "description",
    "company_id",
    "domain_type",
    "custom_domain",
    "default_location",
    "default_currency",
    "default_language",
    "logo_url",
    "icon_url",
    "favicon_url",
    "status",
  ].join(",");

  const sampleData = [
    "Kalixo Store",
    "marketplace",
    "Official Kalixo marketplace for digital products",
    "9898510f-27ed-4ea5-b365-b6cf58847b6d",
    "default",
    "",
    "US",
    "USD",
    "en",
    "https://example.com/logo.png",
    "https://example.com/icon.png",
    "https://example.com/favicon.ico",
    "active",
  ].join(",");

  const csvContent = `${headers}\n${sampleData}`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "channels_import_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
