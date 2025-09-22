"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { DraftCart, useDraftCartStore } from "@/lib/store/draft-cart";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { format } from "@workspace/ui/lib/date-fns";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal, Play, Trash2 } from "@workspace/ui/lucide-react";
import { toast } from "@workspace/ui/sonner";
import AlertConfirmationDialog from "../alert-confirmation-dialog";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
function DraftTable() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResumeConfirmation, setShowResumeConfirmation] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const [selectedCart, setSelectedCart] = useState<DraftCart | null>(null);
  const draftCarts = useDraftCartStore((state) => state.draftCarts);
  const removeDraftCart = useDraftCartStore((state) => state.removeDraftCart);
  const replaceCart = useCartStore((state) => state.replaceCart);

  const locale = useLocale();
  const ct = useTranslations("Common");
  const t = useTranslations("Orders.Draft");

  const onResume = () => {
    if (selectedCart) {
      replaceCart(selectedCart.items);
      toast.success(
        t("Resume.success", {
          id: selectedCart.id,
        })
      );
      setShowResumeConfirmation(false);
      setSelectedCart(null);
      removeDraftCart(selectedCart.id);
    }
  };

  const onDelete = () => {
    if (selectedCartId) {
      removeDraftCart(selectedCartId);
      setShowConfirmation(false);
      toast.success(
        t("Delete.success", {
          id: selectedCartId,
        })
      );
      setSelectedCartId(null);
    }
  };

  return (
    <Card>
      <CardContent>
        <ScrollArea>
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>{t("order")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead>{t("items")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftCarts.length > 0 ? (
                draftCarts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell>{cart.id}</TableCell>
                    <TableCell>
                      {format(new Date(cart.createdAt), "dd MMM yyyy, HH:mm")}
                    </TableCell>
                    <TableCell>{cart.user.name}</TableCell>
                    <TableCell>
                      {formatCurrency(cart.cartPrice / 100, "EUR", locale)}
                    </TableCell>
                    <TableCell>{cart.quantity}</TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">{ct("openMenu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-background border shadow-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setShowResumeConfirmation(true);
                              setSelectedCart(cart);
                            }}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            {ct("resume")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setShowConfirmation(true);
                              setSelectedCartId(cart.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            {ct("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center pt-10">
                    {ct("noDraftCarts")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      <AlertConfirmationDialog
        open={showConfirmation}
        setOpen={setShowConfirmation}
        title={t("Delete.title")}
        description={t("Delete.description")}
        onConfirm={onDelete}
      />
      <AlertConfirmationDialog
        open={showResumeConfirmation}
        setOpen={setShowResumeConfirmation}
        title={t("Resume.title")}
        description={t("Resume.description")}
        onConfirm={onResume}
      />
    </Card>
  );
}

export default DraftTable;
