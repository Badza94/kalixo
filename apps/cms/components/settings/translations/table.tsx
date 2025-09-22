"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import DynamicPagination from "@/components/dynamic-pagination";
import { useTranslations } from "next-intl";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { useState, useCallback } from "react";
import { Save, Check } from "@workspace/ui/lucide-react";

type LocaleOption = {
  value: string;
  label: string;
  icon?: string;
};

type TranslationValue = {
  [localeKey: string]: string;
};

type Translation = {
  id: string;
  key: string;
  values: TranslationValue;
};

interface TranslationsTableProps {
  translations: Translation[];
  locales: LocaleOption[];
  initialLimit: string;
  initialPage: number;
  totalPages: number;
  totalKeys?: number;
}

function TranslationsTable({
  translations,
  locales,
  initialPage,
  initialLimit,
  totalPages,
  totalKeys = 0,
}: TranslationsTableProps) {
  const t = useTranslations("Settings.Translations.table");
  const [editingValues, setEditingValues] = useState<TranslationValue>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleTranslationChange = useCallback(
    (translationId: string, locale: string, value: string) => {
      const key = `${translationId}_${locale}`;
      setEditingValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const getTranslationValue = useCallback(
    (translation: Translation, locale: string) => {
      const key = `${translation.id}_${locale}`;
      return editingValues[key] !== undefined
        ? editingValues[key]
        : translation.values[locale] || "";
    },
    [editingValues]
  );

  const hasUnsavedChanges = Object.keys(editingValues).length > 0;

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      // TODO: Implement actual save logic here
      // This would typically involve:
      // 1. Group changes by locale
      // 2. Send to API endpoint or update files
      // 3. Handle the nested object structure reconstruction

      console.log("Saving changes:", editingValues);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear editing values after successful save
      setEditingValues({});
      setLastSaved(new Date());

      // Show success message
      // toast.success("Translations saved successfully!");
    } catch (error) {
      console.error("Error saving translations:", error);
      // toast.error("Failed to save translations");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("description", {
                count: translations.length,
                total: totalKeys,
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-600" />
                <span>
                  {t("saved", { time: lastSaved.toLocaleTimeString() })}
                </span>
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              size="sm"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </div>
        {hasUnsavedChanges && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center gap-2 text-sm text-orange-800">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span>{t("unsavedChanges")}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-480px)] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-48 min-w-48 bg-card sticky left-0 z-20 border-r">
                  {t("key")}
                </TableHead>
                {locales.map((locale) => (
                  <TableHead
                    key={locale.value}
                    className="min-w-64 text-center"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        {locale.icon && (
                          <CircleFlag
                            countryCode={locale.icon.toLowerCase()}
                            height="16"
                            className="h-4 w-4"
                          />
                        )}
                        <span className="font-medium">{locale.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-normal">
                        {locale.value}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {translations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={locales.length + 1}
                    className="text-center py-8"
                  >
                    {t("noTranslationsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                translations.map((translation) => (
                  <TableRow key={translation.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm bg-card sticky left-0 z-10 border-r font-medium">
                      {translation.key}
                    </TableCell>
                    {locales.map((locale) => {
                      const currentValue = getTranslationValue(
                        translation,
                        locale.value
                      );
                      const originalValue =
                        translation.values[locale.value] || "";
                      const hasChanged = currentValue !== originalValue;

                      return (
                        <TableCell key={locale.value} className="p-2">
                          <Input
                            value={currentValue}
                            onChange={(e) =>
                              handleTranslationChange(
                                translation.id,
                                locale.value,
                                e.target.value
                              )
                            }
                            placeholder={t("enterTranslation", {
                              locale: locale.label,
                            })}
                            className={`w-full border-0 bg-transparent focus:bg-background focus:border-input hover:bg-background/50 transition-colors ${
                              hasChanged ? "bg-blue-50 border-blue-200" : ""
                            }`}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <DynamicPagination
          currentPage={initialPage || 1}
          totalPages={totalPages || 1}
          initialLimit={initialLimit}
        />
      </CardFooter>
    </Card>
  );
}

export default TranslationsTable;
