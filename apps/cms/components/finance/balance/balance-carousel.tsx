"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import currencies from "@/data/currencies.json";
import { cn } from "@workspace/ui/lib/utils";
import { AddFundsModal } from "./add-funds-modal";
import { SetSpendingModal } from "./set-spending-modal";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Bell,
  MoreHorizontal,
  PlusIcon,
  Star,
  Target,
  TriangleAlert,
} from "@workspace/ui/lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useTranslations } from "next-intl";
import { Currency } from "@/types";

export interface Wallet {
  id: number;
  country: string;
  currency: string;
  balance: number;
  isDefault: boolean;
  countryCode: string;
  limit?: number | null;
}

interface BalanceCarouselProps {
  wallets: Wallet[];
}

function getCurrencyInfo(currencyCode: string): Currency | undefined {
  return currencies.find((c) => c.value === currencyCode);
}

export default function BalanceCarousel({ wallets }: BalanceCarouselProps) {
  const t = useTranslations("Finance.Balance.BalanceCarousel");
  const [modalWallet, setModalWallet] = useState<Wallet | null>(null);
  const [spendingModalWallet, setSpendingModalWallet] = useState<Wallet | null>(
    null
  );

  // Split wallets into chunks of 8 for each slide
  const slides: Wallet[][] = [];
  for (let i = 0; i < wallets.length; i += 8) {
    slides.push(wallets.slice(i, i + 8));
  }

  return (
    <>
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, idx) => (
            <CarouselItem key={idx} className="">
              <div className="grid grid-cols-1 grid-rows-8 lg:grid-cols-2 lg:grid-rows-4 xl:grid-cols-4 xl:grid-rows-2 gap-6">
                {slide.map((wallet) => {
                  const currency = getCurrencyInfo(wallet.currency);
                  return (
                    <Card
                      key={wallet.id}
                      className={cn(
                        "relative flex flex-col justify-between w-full",
                        wallet.isDefault && "border-primary"
                      )}
                    >
                      <CardContent className="flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 w-full">
                            <CircleFlag
                              countryCode={wallet.countryCode.toLowerCase()}
                              className="w-6 h-6"
                            />
                            <div className="flex flex-col gap-1 max-w-[140px]">
                              <div
                                className="font-semibold text-lg truncate"
                                title={wallet.country}
                              >
                                {wallet.country}
                              </div>
                              <p className="text-muted-foreground text-xs">
                                {currency?.label || wallet.currency}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => setSpendingModalWallet(wallet)}
                                >
                                  <Target className="mr-2 h-4 w-4" />
                                  {wallet.limit
                                    ? t("changeLimit")
                                    : t("setLimit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="mr-2 h-4 w-4" />
                                  {t("setReminders")}
                                </DropdownMenuItem>
                                {!wallet.isDefault && (
                                  <DropdownMenuItem>
                                    <Star className="mr-2 h-4 w-4" />
                                    {t("setAsDefault")}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">
                            {currency?.symbol || wallet.currency}
                            {wallet.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            onClick={() => setModalWallet(wallet)}
                            aria-label={t("addFunds", {
                              currency: wallet.currency,
                            })}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        {!wallet.limit && (
                          <div className="flex items-center gap-2">
                            <TriangleAlert className="w-4 h-4 text-red-500" />
                            <p className="text-xs text-red-500">
                              {t("noLimitSet")}
                            </p>
                          </div>
                        )}
                        {wallet.isDefault ? (
                          <Badge className="w-fit">{t("default")}</Badge>
                        ) : (
                          <span></span>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {modalWallet && (
        <AddFundsModal
          open={!!modalWallet}
          onOpenChange={(open) => !open && setModalWallet(null)}
          currency={modalWallet?.currency || ""}
        />
      )}

      {spendingModalWallet && (
        <SetSpendingModal
          open={!!spendingModalWallet}
          onOpenChange={(open) => !open && setSpendingModalWallet(null)}
          currency={spendingModalWallet?.currency || ""}
          wallet={spendingModalWallet}
        />
      )}
    </>
  );
}
