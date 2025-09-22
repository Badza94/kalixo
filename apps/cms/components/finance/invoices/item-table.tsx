"use client";
import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
} from "@workspace/ui/lucide-react";
import { cn, formatCurrency } from "@workspace/ui/lib/utils";
import { useTranslations } from "next-intl";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import Image from "next/image";

// Import products data
import productsData from "@/data/productsData.json";

export interface Product {
  id: number;
  productId: string;
  name: string;
  price: string;
  currencyCode: string;
  denominationType: string;
  denominationMinValue: number;
  denominationMaxValue: number;
  denominationStep: number;
  image: string;
}

export interface ItemRow {
  id: string;
  product: Product | null;
  quantity: number;
  rate: number;
  discount: number;
  tax: number;
  amount: number;
}

interface ItemTableProps {
  items: ItemRow[];
  onItemsChange: (items: ItemRow[]) => void;
  adjustment: number;
  onAdjustmentChange: (adjustment: number) => void;
}

export default function ItemTable({
  items,
  onItemsChange,
  adjustment,
  onAdjustmentChange,
}: ItemTableProps) {
  const t = useTranslations("Finance.Invoices");
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNewRow = () => {
    const newRow: ItemRow = {
      id: generateId(),
      product: null,
      quantity: 1,
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0,
    };
    onItemsChange([...items, newRow]);
  };

  const removeRow = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof ItemRow,
    value: string | number | Product | null
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Auto-calculate amount when quantity, rate, discount, or tax changes
        if (
          field === "quantity" ||
          field === "rate" ||
          field === "discount" ||
          field === "tax"
        ) {
          const subtotal = updatedItem.quantity * updatedItem.rate;
          const discountAmount = (subtotal * updatedItem.discount) / 100;
          const afterDiscount = subtotal - discountAmount;
          const taxAmount = (afterDiscount * updatedItem.tax) / 100;
          updatedItem.amount = afterDiscount + taxAmount;
        }

        return updatedItem;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  const selectProduct = (itemId: string, product: Product) => {
    // Update both product and rate in a single operation to avoid race conditions
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          product: product,
          rate: parseFloat(product.price),
        };

        // Auto-calculate amount with new rate
        const subtotal = updatedItem.quantity * updatedItem.rate;
        const discountAmount = (subtotal * updatedItem.discount) / 100;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * updatedItem.tax) / 100;
        updatedItem.amount = afterDiscount + taxAmount;

        return updatedItem;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  // Calculate totals
  const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subTotal + adjustment / 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("itemTable")}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button" onClick={addNewRow}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addNewRow")}
          </Button>
          <Button variant="outline" size="sm" type="button">
            {t("addItemsInBulk")}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t("product")}</TableHead>
              <TableHead className="w-[100px]">{t("quantity")}</TableHead>
              <TableHead className="w-[120px]">{t("rate")}</TableHead>
              <TableHead className="w-[100px]">{t("discount")}</TableHead>
              <TableHead className="w-[100px]">{t("tax")}</TableHead>
              <TableHead className="w-[120px] text-right">
                {t("amount")}
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <ProductCombobox
                    value={item.product}
                    onSelect={(product) => selectProduct(item.id, product)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step={
                      item.product?.denominationType === "open"
                        ? item.product.denominationStep
                        : 0.01
                    }
                    value={item.rate / 100}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "rate",
                        parseFloat(e.target.value) * 100 || 0
                      )
                    }
                    onFocus={(e) => e.target.select()}
                    // Only allow editing for "open" denomination products
                    disabled={item.product?.denominationType !== "open"}
                    // Set min/max based on product denomination limits (convert from cents)
                    min={
                      item.product?.denominationType === "open"
                        ? item.product.denominationMinValue / 100
                        : undefined
                    }
                    max={
                      item.product?.denominationType === "open"
                        ? item.product.denominationMaxValue / 100
                        : undefined
                    }
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "discount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      onFocus={(e) => e.target.select()}
                      className="w-full"
                    />
                    <span className="ml-1 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.tax}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "tax",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      onFocus={(e) => e.target.select()}
                      className="w-full"
                    />
                    <span className="ml-1 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-right font-medium">
                    {formatCurrency(
                      item.amount / 100,
                      item.product?.currencyCode || "EUR"
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeRow(item.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("noItemsAdded")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Section */}
      <div className="flex justify-end">
        <div className="w-80 space-y-4 border rounded-lg p-4">
          {/* Sub Total */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("subTotal")}</span>
            <span className="text-sm font-semibold">
              {formatCurrency(
                subTotal,
                items[0]?.product?.currencyCode || "EUR"
              )}
            </span>
          </div>

          {/* Adjustment */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("adjustment")}</span>
            <div className="w-24">
              <Input
                type="number"
                step="0.01"
                value={adjustment / 100}
                onChange={(e) =>
                  onAdjustmentChange(parseFloat(e.target.value) * 100 || 0)
                }
                onFocus={(e) => e.target.select()}
                className="text-right text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">
              {t("total")} ({items[0]?.product?.currencyCode || "EUR"})
            </span>
            <span className="font-bold text-lg">
              {formatCurrency(total, items[0]?.product?.currencyCode || "EUR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCombobox({
  value,
  onSelect,
}: {
  value: Product | null;
  onSelect: (product: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Finance.Invoices");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <div className="flex items-center gap-2 truncate">
              <Image
                src={value.image}
                alt={value.name}
                width={16}
                height={16}
                className="w-4 h-auto"
              />
              <span className="truncate">
                {value.name} (ID: {value.id})
              </span>
            </div>
          ) : (
            t("selectProduct")
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={t("searchProducts")} className="h-9" />
          <CommandList>
            <CommandEmpty>{t("noProductFound")}</CommandEmpty>
            <CommandGroup>
              {productsData.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id.toString()}
                  onSelect={(currentValue) => {
                    // Find the product by id
                    const selectedProduct = productsData.find((p) => {
                      return p.id.toString() === currentValue;
                    });
                    if (selectedProduct) {
                      onSelect(selectedProduct as Product);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={16}
                      height={16}
                      className="w-4 h-auto"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {product.id} • {product.currencyCode}{" "}
                        {product.price}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value?.id === product.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
