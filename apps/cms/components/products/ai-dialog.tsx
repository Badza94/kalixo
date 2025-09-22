"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";

import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import { useProductAIEnhancement } from "@/hooks/use-product-ai-enhancement";

interface ProductAIDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleAcceptAiSuggestions: (suggestions: {
    title: string;
    longDescription: string;
    shortDescription: string;
    tags: string[];
    category: string[];
    subCategories: string[];
    productType: string;
  }) => void;
}

const ProductAIDialog: React.FC<ProductAIDialogProps> = ({
  productId,
  open,
  onOpenChange,
  handleAcceptAiSuggestions,
}) => {
  const t = useTranslations("Products.AI");
  const ft = useTranslations("Products.Form");
  const ct = useTranslations("Common");
  const { product, aiSuggestions, isLoading, error } = useProductAIEnhancement(
    productId,
    open
  );

  // Handle error state
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl p-0">
          <DialogHeader className="bg-white dark:bg-card p-4 rounded-t-lg border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{t("errorTitle")}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-6">
            <p className="text-red-500">{t("errorDescription")}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="bg-card p-4 rounded-t-lg border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-xl">
                {t("aiEnhancement")}: {product?.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-auto">
          <div className="p-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("aiGeneratedTitle")}</CardTitle>
                  <Button
                    onClick={() => {
                      handleAcceptAiSuggestions(aiSuggestions);
                      onOpenChange(false);
                    }}
                  >
                    {ct("accept")}
                  </Button>
                </div>
                <CardDescription>{t("review")}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <p>{t("loading")}</p>}
                {aiSuggestions && (
                  <Table className="table-fixed w-full overflow-x-auto whitespace-normal">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("attributes")}</TableHead>
                        <TableHead>{t("currentData")}</TableHead>
                        <TableHead>{t("aiSuggestions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("productTitle")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.title}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.title}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("description")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.longDescription}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.longDescription}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("shortDescription")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.shortDescription}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.shortDescription}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("tags")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.tags.join(", ")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.tags.join(", ")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("categories")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.category.join(", ")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.category.join(", ")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("subCategories")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.subCategories.join(", ")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.subCategories.join(", ")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {ft("type")}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {product?.productType}
                        </TableCell>
                        <TableCell className="w-1/3 break-all whitespace-normal">
                          {aiSuggestions?.productType}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAIDialog;
