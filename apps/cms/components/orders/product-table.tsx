/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { cn, formatCurrency } from "@workspace/ui/lib/utils";

import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { ArrowUpDown, Heart, Plus } from "@workspace/ui/lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { useRouter } from "@/i18n/routing";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourite";
import { useCartProductInputs } from "@/hooks/place-order-hooks";
import DynamicPagination from "../dynamic-pagination";

function ProductTable({
  products,
  initialSort,
  initialLimit,
  initialPage,
  totalPages,
}: {
  products: any[];
  initialSort: string;
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}) {
  const [sort, setSort] = useState(initialSort);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const t = useTranslations("Common");
  const st = useTranslations("Sort");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    // Get current search params to preserve filters from Filters component
    const currentParams = new URLSearchParams(window.location.search);

    // Update only the parameters this component controls
    if (sort && sort !== "newest") {
      currentParams.set("sort", sort);
    } else {
      currentParams.delete("sort");
    }

    router.push(`/orders/place-order?${currentParams.toString()}`, {
      scroll: false,
    });
  }, [router, sort]);

  // Handle quantity change
  const handleQuantityChange = (productId: number, value: string) => {
    if (value === "") {
      setQuantities((prev) => ({ ...prev, [productId]: "" }));
      return;
    }

    // Only allow numbers, no negatives or decimals
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    // Prevent leading zeros
    const finalValue = sanitizedValue.replace(/^0+(?=\d)/, "");
    setQuantities((prev) => ({ ...prev, [productId]: finalValue }));
  };

  const favourites = useFavouritesStore((state) => state.favourites);
  const addFavourite = useFavouritesStore((state) => state.addFavourite);
  const removeFavourite = useFavouritesStore((state) => state.removeFavourite);

  // Toggle wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    // add it or remove it from the favourites store
    const isWishlisted = wishlist.includes(productId);
    if (isWishlisted) {
      removeFavourite(productId.toString());
    } else {
      addFavourite(productId.toString());
    }
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    const price = customPrices[product.id] || product.denominationDefaultValue;

    addToCart(product, price, Number(quantity));
  };

  useEffect(() => {
    // set the wishlist from the favourites store
    setWishlist(favourites.map((id) => Number(id)));
  }, [favourites]);

  const {
    customPrices,
    quantities,
    setQuantities,
    calculateSubtotal,
    getDisplayPrice,
    handlePriceInputChange,
    handlePriceBlur,
  } = useCartProductInputs(cart);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className={cn("w-[180px] justify-between")}>
              <div className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2 opacity-70" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{st("newest")}</SelectItem>
              <SelectItem value="oldest">{st("oldest")}</SelectItem>
              <SelectItem value="name_asc">{st("name_asc")}</SelectItem>
              <SelectItem value="name_desc">{st("name_desc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="min-w-[750px] w-[750px] lg:w-[900px]">
                  Name & Details
                </TableHead>
                <TableHead className="min-w-[150px]">Price</TableHead>
                <TableHead className="min-w-[150px]">Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>You Pay</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const regionNames = new Intl.DisplayNames([locale], {
                  type: "region",
                });

                const quantity = quantities[product.id];
                const subtotal = calculateSubtotal(product);
                const isWishlisted = wishlist.includes(product.id);
                const isInCart = cart.some((item) => item.id === product.id);

                return (
                  <TableRow key={product.id}>
                    {/* Name & Details */}
                    <TableCell>
                      <div className="flex gap-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-cover rounded-md"
                        />
                        <div className="flex flex-col w-full space-y-4">
                          <h2 className="mt-2 text-xl font-bold">
                            {product.name}
                          </h2>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="justify-between col-span-1">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div>ID</div>
                                  <div>{product.id}</div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div>EAN</div>
                                  <div>{product.ean}</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div>Brand</div>
                                  <div>{product.brand}</div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div>Country</div>
                                  <div className="flex items-center gap-2">
                                    <CircleFlag
                                      className="w-4 h-4"
                                      countryCode={product.countryCode.toLowerCase()}
                                    />
                                    {regionNames.of(
                                      product.countryCode.toUpperCase()
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-1">
                              <div className="flex flex-col w-full gap-1">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div>Type</div>
                                  <div>{product.type}</div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div>Category</div>
                                  <div>{product.category}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="self-start w-8 h-8 mt-2 ml-auto group dark:hover:bg-transparent hover:bg-transparent"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors size-5 ${
                              isWishlisted ? "fill-primary text-primary" : ""
                            } group-hover:fill-primary group-hover:text-primary`}
                          />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      {product.denominationType === "open" ? (
                        <Input
                          type="text"
                          value={getDisplayPrice(product)}
                          onChange={(e) =>
                            handlePriceInputChange(product, e.target.value)
                          }
                          onBlur={() => handlePriceBlur(product)}
                        />
                      ) : (
                        <Input
                          type="text"
                          value={product.price / 100}
                          disabled
                        />
                      )}
                    </TableCell>

                    {/* Quantity */}
                    <TableCell>
                      <Input
                        type="text"
                        value={
                          quantities[product.id] === ""
                            ? ""
                            : quantities[product.id] || 1
                        }
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                      />
                    </TableCell>

                    {/* Subtotal */}
                    <TableCell>
                      {formatCurrency(subtotal, product.currencyCode, locale)}
                    </TableCell>

                    {/* You Pay */}
                    <TableCell>
                      {formatCurrency(subtotal, product.currencyCode, locale)}
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <Button
                        disabled={Number(quantity) <= 0}
                        onClick={() => handleAddToCart(product)}
                        variant={isInCart ? "secondary" : "default"}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {isInCart ? t("update") : t("add")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicPagination
          currentPage={initialPage || 1}
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>
    </Card>
  );
}

export default ProductTable;
