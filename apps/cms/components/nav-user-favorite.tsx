import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";

import { Button } from "@workspace/ui/components/button";
import { Heart, Trash2, X } from "@workspace/ui/lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import Image from "next/image";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { useCartProductInputs } from "@/hooks/place-order-hooks";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useFavouritesStore } from "@/lib/store/favourite";
import products from "@/data/productsData.json";

function NavUserFavorite() {
  const t = useTranslations("UserNav");
  const ct = useTranslations("Common");

  const locale = useLocale();

  const [openDialog, setOpenDialog] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
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

  useEffect(() => {
    // set the wishlist from the favourites store
    setWishlist(favourites.map((id) => Number(id)));
  }, [favourites]);

  const favouriteCount = favourites.length;
  const cart = useCartStore((state) => state.cart);

  const { getDisplayPrice } = useCartProductInputs(cart);
  // find the products in the favourites array
  const favouriteProducts = products.filter((product) =>
    favourites.includes(product.id.toString())
  );

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <Drawer open={openDialog} onOpenChange={setOpenDialog} direction="right">
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground">
            {favouriteCount}
          </div>
          <Heart className="h-8 w-8 !size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full ml-auto data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-md">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-base font-semibold flex w-full">
              {t("favoriteProducts")}
            </DrawerTitle>

            <DrawerClose className="flex">
              <X className="h-4 w-4" />
            </DrawerClose>
          </div>
        </DrawerHeader>
        {favouriteCount > 0 ? (
          <ScrollArea className="h-[calc(100vh-75px)] space-y-4 px-4 mb-4">
            {favouriteProducts.map((product) => {
              const price = getDisplayPrice(product);
              const isWishlisted = wishlist.includes(product.id);

              return (
                <Card key={product.id} className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={product.image as string}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover h-[80px]"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex flex-col flex-grow space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 group dark:hover:bg-transparent hover:bg-transparent"
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <Heart
                                className={`h-4 w-4 transition-colors size-5 ${
                                  isWishlisted
                                    ? "fill-primary text-primary"
                                    : ""
                                } group-hover:fill-primary group-hover:text-primary`}
                              />
                              <span className="sr-only">
                                {t("addToWishlist")}
                              </span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                removeFavourite(product.id.toString())
                              }
                            >
                              <Trash2 className="h-4 w-4 transition-colors group-hover:fill-primary group-hover:text-primary" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-b border-spacing-y-2 pb-2 mt-2">
                          <div className="flex">
                            <span className="text-sm text-muted-foreground">
                              {ct("brand")}:
                            </span>
                            <span className="ml-1 text-sm">
                              {product.brand}
                            </span>
                          </div>
                          <div className="flex items-center justify-end">
                            <span className="text-sm text-muted-foreground">
                              {ct("country")}:
                            </span>
                            <div className="flex items-center ml-1 gap-1 text-sm">
                              <CircleFlag
                                countryCode={
                                  product?.countryCode?.toLowerCase() || "EU"
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {product.countryCode || "EU"}
                              </span>
                            </div>
                          </div>
                          <div className="flex">
                            <span className="text-sm text-muted-foreground">
                              {ct("type")}:
                            </span>
                            <span className="ml-1 text-sm">{product.type}</span>
                          </div>
                          <div className="flex items-center justify-end">
                            <span className="text-sm text-muted-foreground">
                              {ct("category")}:
                            </span>
                            <span className="ml-1 text-sm">
                              {product.category || "-"}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-sm text-muted-foreground">
                              {ct("platform")}:
                            </span>
                            <span className="ml-1 text-sm">
                              {product?.platform || "-"}
                            </span>
                          </div>
                          <div className="flex items-center justify-end">
                            <span className="text-sm text-muted-foreground">
                              {ct("price")}:
                            </span>
                            <span className="ml-1 text-sm">
                              {formatCurrency(
                                Number(price),
                                product.currencyCode || "USD",
                                locale
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                              {formatCurrency(999, "EUR", locale)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(
                                Number(product.price),
                                product.currencyCode || "USD",
                                locale
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button
                              onClick={() =>
                                addToCart(product, Number(product.price), 1)
                              }
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">{t("favEmpty")}</h3>
            <p className="text-sm">{t("favDescription")}</p>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
export default NavUserFavorite;
