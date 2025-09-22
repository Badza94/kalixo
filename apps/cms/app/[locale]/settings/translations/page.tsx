import React from "react";
import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import TranslationsFilters from "@/components/settings/translations/filters";
import { AddTranslationDialog } from "@/components/settings/translations/add-dialog";
import TranslationsTable from "@/components/settings/translations/table";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { LocaleOption } from "@/types";

interface SearchParams {
  types?: string;
  subtypes?: string;
  limit?: string;
  page?: string;
  locales?: string;
}

// Dynamic function to create locale mapping from locale codes
function createLocaleMapping(localeCode: string) {
  try {
    // Split locale code (e.g., "en_US" -> ["en", "US"])
    const [languageCode, countryCode] = localeCode.includes("_")
      ? localeCode.split("_")
      : [localeCode, ""];

    // Use Intl.DisplayNames to get language and region names
    const languageDisplay = new Intl.DisplayNames(["en"], { type: "language" });
    const regionDisplay = new Intl.DisplayNames(["en"], { type: "region" });

    const languageName = languageDisplay.of(languageCode || "") || languageCode;
    const regionName = countryCode ? regionDisplay.of(countryCode) : "";

    // Create human-readable label
    const label = regionName ? `${languageName} (${regionName})` : languageName;

    return {
      label,
      countryCode: countryCode?.toLowerCase() || languageCode?.toLowerCase(),
    };
  } catch (error) {
    // Fallback for unsupported locale codes
    console.warn(`Could not parse locale: ${localeCode}`, error);
    return {
      label: localeCode,
      countryCode: localeCode.toLowerCase(),
    };
  }
}

// Function to flatten nested objects into dot notation
function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = ""
): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(
        flattened,
        flattenObject(value as Record<string, unknown>, newKey)
      );
    } else if (typeof value === "string") {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

// Function to read and parse translation files
async function loadTranslations(localeFiles: string[]) {
  const translationsDir = join(process.cwd(), "translations");
  const translations: Record<string, Record<string, string>> = {};

  // Read all translation files
  for (const localeFile of localeFiles) {
    try {
      const filePath = join(translationsDir, `${localeFile}.json`);
      const fileContent = await readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileContent);

      // Flatten the nested structure
      translations[localeFile] = flattenObject(jsonData);
    } catch (error) {
      console.error(
        `Error reading translation file ${localeFile}.json:`,
        error
      );
      translations[localeFile] = {};
    }
  }

  // Get all unique translation keys
  const allKeys = new Set<string>();
  for (const locale of Object.values(translations)) {
    Object.keys(locale).forEach((key) => allKeys.add(key));
  }

  // Convert to table format
  const translationData = Array.from(allKeys).map((key, index) => {
    const values: Record<string, string> = {};

    // Populate values for each locale
    localeFiles.forEach((localeFile) => {
      values[localeFile] = translations[localeFile]?.[key] || "";
    });

    return {
      id: (index + 1).toString(),
      key,
      values,
    };
  });

  return translationData.sort((a, b) => a.key.localeCompare(b.key));
}

async function TranslationsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("Settings.Translations");

  // Dynamically read locales from translations folder
  const translationsDir = join(process.cwd(), "translations");
  const files = await readdir(translationsDir);
  const localeFiles = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));

  // Create locale options with dynamically generated labels and flags
  const locales = localeFiles.map((locale) => {
    const mapping = createLocaleMapping(locale);
    return {
      value: locale,
      label: mapping.label,
      icon: mapping.countryCode,
    };
  });

  // Load actual translation data from JSON files
  const translationData = await loadTranslations(localeFiles);

  // Apply pagination - for now showing first 10, later implement proper pagination
  const limit = parseInt(searchParams.limit || "10");
  const page = parseInt(searchParams.page || "1");
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTranslations = translationData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(translationData.length / limit);

  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialLocales = searchParams.locales
    ? Array.isArray(searchParams.locales)
      ? searchParams.locales
      : [searchParams.locales]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <AddTranslationDialog locales={locales as unknown as LocaleOption[]} />
      </div>

      <TranslationsFilters
        initialLocales={initialLocales}
        locales={locales as unknown as string[]}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <TranslationsTable
            translations={paginatedTranslations}
            locales={locales as unknown as LocaleOption[]}
            initialLimit={initialLimit}
            initialPage={initialPage}
            totalPages={totalPages}
            totalKeys={translationData.length}
          />
        </div>
      </div>
    </div>
  );
}

export default TranslationsPage;
