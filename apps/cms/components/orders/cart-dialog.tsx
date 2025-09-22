import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { processingTimeOptions } from "@/enums/processingTimes";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import Image from "next/image";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { useLocale } from "next-intl";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";

const cartDialogSchema = z.object({
  invNumber: z.string().min(1, "Invoice number is required"),
  processingTime: z.string().min(1, "Processing time is required"),
});

type CartDialogForm = z.infer<typeof cartDialogSchema>;

export function CartDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const locale = useLocale();
  const session: any = undefined;
  const user = session?.user;

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<{ orderId: number } | null>(null);

  const form = useForm<CartDialogForm>({
    resolver: zodResolver(cartDialogSchema),
    defaultValues: {
      invNumber: "",
      processingTime: "",
    },
  });

  const onSubmit = (data: CartDialogForm) => {
    // Handle order placement logic here
    console.log("Order placed with data:", data);
    setOrderPlaced(true);
    setOrderData({
      orderId: 56289,
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!orderPlaced ? (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Place the Order</DialogTitle>
            <DialogDescription>
              Before placing your order, please verify the items in your basket!
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="invNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter invoice number" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Time</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue=""
                      >
                        <SelectTrigger className="w-full" id="processingTime">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {processingTimeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ScrollArea className="space-y-4 h-[350px] pb-4">
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 mr-3">
                      <div className="flex justify-between">
                        <div className="flex gap-4 items-center">
                          <Image
                            src={item.image as string}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md max-h-[75px]"
                          />
                          <div className="flex flex-col justify-between max-w-60">
                            <h2>{item.name}</h2>
                            <div className="flex items-center gap-2 h-9">
                              <span className="text-sm text-muted-foreground">
                                {item.brand}
                              </span>
                              <CircleFlag
                                countryCode={
                                  item?.countryCode?.toLowerCase() || ""
                                }
                                className="w-4 h-4"
                              />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <p className="text-muted-foreground">Price</p>
                            {formatCurrency(
                              Number(item.price) / 100,
                              item.currencyCode || "EUR",
                              locale
                            )}
                          </div>
                          <div className="flex flex-col justify-between items-end gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <p className="text-muted-foreground">
                                Cart Price
                              </p>
                              {formatCurrency(
                                Number(item.cartPrice) / 100,
                                item.currencyCode || "EUR",
                                locale
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <DialogFooter className="sm:flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-muted-foreground">Total</h2>
                  <h2 className="text-muted-foreground">
                    {formatCurrency(getTotalPrice(), "EUR", locale)}
                  </h2>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.formState.isValid}
                >
                  Place Order
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thank you for your order</DialogTitle>
          </DialogHeader>
          <p>
            Dear {user?.name} your order{" "}
            <Link
              href={`/orders/${orderData?.orderId}`}
              className="text-primary underline underline-offset-4"
            >
              {orderData?.orderId}
            </Link>{" "}
            has been successfully placed.
          </p>
          <p className="text-muted-foreground">
            We’re here for you if you have any questions, drop us a message at{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="mailto:hello@kalixo.io"
            >
              hello@kalixo.io
            </a>
          </p>
        </DialogContent>
      )}
    </Dialog>
  );
}
