/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import { useForm } from "@workspace/ui/lib/react-hook-form";
import * as z from "@workspace/ui/lib/zod";
import { zodResolver } from "@workspace/ui/lib/hookform";
import notesData from "@/data/notes.json";

import PageTitle from "../page-title";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  LogIn,
  PlusIcon,
  X,
} from "@workspace/ui/lucide-react";
import { SelectSearch } from "@workspace/ui/components/select-search";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { CustomerStatusBadge } from "./status-badge";
import { format } from "@workspace/ui/lib/date-fns";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { cn } from "@workspace/ui/lib/utils";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Textarea } from "@workspace/ui/components/textarea";
import { toast } from "@workspace/ui/sonner";
import { Timeline, TimelineEntry } from "@workspace/ui/components/timeline";
import timelineData from "@/data/timeline-fake.json";
import Notes from "../notes";
// import { User } from "next-auth";

enum STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
  REVIEW = "review",
}

const CUSTOMER_STATUSES = [
  {
    label: "Active",
    value: STATUS.ACTIVE,
  },
  {
    label: "Inactive",
    value: STATUS.INACTIVE,
  },
  {
    label: "Blocked",
    value: STATUS.BLOCKED,
  },
  {
    label: "In Review",
    value: STATUS.REVIEW,
  },
];

type TCustomerFormProps = {
  id: string;
  countries: any[];
  customer?: any;
  channels?: any[];
  currentUser: any;
};

function CustomerForm({
  id,
  countries,
  customer,
  channels,
  currentUser,
}: TCustomerFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<any[]>(
    customer?.defaultChannel ? [customer.defaultChannel] : []
  );
  const [isChannelPickerOpen, setIsChannelPickerOpen] = useState(false);
  const [addNote, setAddNote] = useState(false);
  const [notes, setNotes] = useState<any[]>(notesData);

  const ct = useTranslations("Common");
  const ft = useTranslations("Forms");
  const t = useTranslations("Customers");

  const formSchema = z.object({
    firstName: z.string().min(1, { message: ft("Errors.requiredFirstName") }),
    lastName: z.string().min(1, { message: ft("Errors.requiredLastName") }),
    email: z.string().email({ message: ft("Errors.invalidEmail") }),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    countryCode: z.string().optional(),
    postalCode: z.string().optional(),
    status: z.enum(["active", "inactive", "blocked", "review"], {
      message: ft("Errors.requiredStatus"),
    }),
    channels: z.array(z.string()),
    note: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: customer?.city || "",
      countryCode: customer?.countryCode || "",
      postalCode: customer?.postalCode || "",
      status: customer?.status || STATUS.ACTIVE,
      channels: customer?.channels || [],
      note: "",
    },
  });

  const countriesData = countries.map((country) => ({
    value: country.value,
    label: (
      <div className="flex items-center gap-2">
        <CircleFlag
          className="h-4 w-4"
          countryCode={country.value.toLowerCase()}
        />
        {country.name}
      </div>
    ),
  }));

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsEditing(false);
    // Here you would typically send the updated values to your API
    toast.success("Customer information updated successfully!");
  }

  const handleRemoveChannel = (channelName: string) => {
    const newSelectedChannels = selectedChannels.filter(
      (channel) => channel !== channelName
    );
    setSelectedChannels(newSelectedChannels);
    form.setValue("channels", newSelectedChannels);
  };

  const handleAddNote = (note: string | undefined) => {
    if (note) {
      setNotes((prevNotes) => [...prevNotes, note]);
      form.setValue("note", "");
    }
    setAddNote(false);
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/customers`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <PageTitle title="Test Customer" description={`Customer ID: ${id}`} />
        </div>
        <div className="flex items-center gap-2 relative">
          {isEditing ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="transition-all duration-200 ease-in-out"
              >
                {ct("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="transition-all duration-200 ease-in-out"
              >
                {ct("save")}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="animate-fade-in transition-all duration-200 ease-in-out"
            >
              {ct("edit")}
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("customerInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("firstName")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("firstNamePlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("lastName")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("lastNamePlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("email")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("emailPlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("phone")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("phonePlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("address")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("addressPlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("city")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("cityPlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("country")}</FormLabel>
                            <FormControl>
                              <SelectSearch
                                data={countriesData}
                                placeholder={ft("selectCountry")}
                                nothingFound={ct("nothingFound")}
                                value={field.value || ""}
                                setValue={field.onChange}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("postalCode")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("postalCodePlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("orders")}</CardTitle>
                    <Link
                      href={`/customers/${id}/orders`}
                      className={buttonVariants({
                        variant: "secondary",
                      })}
                    >
                      {t("viewAllOrders")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{ct("orderId")}</TableHead>
                        <TableHead>{ct("channel")}</TableHead>
                        <TableHead>{ct("quantity")}</TableHead>
                        <TableHead>{ct("amount")}</TableHead>
                        <TableHead>{ct("status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>123456</TableCell>
                        <TableCell>Online</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>Completed</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("timeline")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Timeline entries={timelineData as TimelineEntry[]} />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4 flex flex-col">
              <Card>
                <CardHeader>
                  <CardTitle>{ct("status")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          disabled={!isEditing}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={ct("selectStatus")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CUSTOMER_STATUSES.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <CustomerStatusBadge
                                  status={status.value.toLowerCase()}
                                  label={ct(status.value.toLowerCase())}
                                />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("activity")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {ct("joinedDate")}
                    </span>
                    <span className="ml-auto">
                      {customer?.createdAt
                        ? format(new Date(customer.createdAt), "MMM d, yyyy")
                        : ct("unknown")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {ct("lastLogin")}
                    </span>
                    <span className="ml-auto">
                      {customer?.lastLogin
                        ? format(new Date(customer.lastLogin), "PPp")
                        : ct("never")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("insights")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("totalQuantity")}
                    </span>
                    <span>{customer?.totalQuantity || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("totalAmount")}
                    </span>
                    <span>
                      {customer?.totalAmount
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "EUR",
                          }).format(customer.totalAmount)
                        : "€0,00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CLV</span>
                    <span>
                      {customer?.clv
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "EUR",
                          }).format(customer.clv)
                        : "€0,00"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {t("channels")}
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setIsChannelPickerOpen(true)}
                      disabled={!isEditing}
                    >
                      <PlusIcon className="h-4 w-4" />
                      {t("addChannel")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedChannels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedChannels.map((ch) => {
                        const channel = channels?.find(
                          (c) => c.resellerCode === ch.resellerCode
                        );
                        return (
                          <Badge
                            key={ch?.resellerCode}
                            variant="secondary"
                            className="flex items-center gap-2 pr-2"
                          >
                            <Avatar className="h-4 w-4 rounded-full">
                              <AvatarImage
                                src={channel?.image as string}
                                alt={channel?.resellerCode as string}
                              />
                              <AvatarFallback className="rounded-full">
                                {channel?.resellerCode?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {ch?.resellerCode}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() =>
                                handleRemoveChannel(ch?.resellerCode)
                              }
                              disabled={!isEditing}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t("noChannelsAssigned")}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>{t("tags")}</CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {customer?.tags.length ? (
                      customer?.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("noPurchaseHistoryTags")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Notes notes={notes} currentUser={currentUser} companyId={id} />
            </div>
          </div>
          <Dialog
            open={isChannelPickerOpen}
            onOpenChange={setIsChannelPickerOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t("addChannel")}</DialogTitle>
                <DialogDescription>
                  {t("addChannelDescription")}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <FormField
                  control={form.control}
                  name="channels"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("channels")}</FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value.length && "text-muted-foreground"
                              )}
                            >
                              {field.value.length > 0
                                ? `${field.value.length} selected`
                                : "Select channels"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                          <Command className="z-50">
                            <CommandInput
                              placeholder="Search channels..."
                              className="z-50"
                            />
                            <CommandList>
                              <CommandEmpty>{t("noChannels")}</CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-[200px]">
                                  {channels?.map((channel) => (
                                    <CommandItem
                                      key={channel.value}
                                      value={channel.resellerCode}
                                      onSelect={() => {
                                        const isSelected =
                                          selectedChannels.includes(
                                            channel.value
                                          );
                                        const newSelectedItems = isSelected
                                          ? selectedChannels.filter(
                                              (value) =>
                                                value !== channel.resellerCode
                                            )
                                          : [
                                              ...selectedChannels,
                                              channel.resellerCode,
                                            ];

                                        setSelectedChannels(newSelectedItems);
                                        form.setValue(
                                          "channels",
                                          newSelectedItems
                                        );
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage
                                            src={
                                              channel.image ||
                                              "/placeholder.svg"
                                            }
                                            alt={channel.label}
                                          />
                                          <AvatarFallback>
                                            {channel.label.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>{channel.label}</span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          selectedChannels.includes(
                                            channel.resellerCode
                                          )
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ScrollArea>
              <DialogFooter className="gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsChannelPickerOpen(false)}
                >
                  {ct("cancel")}
                </Button>
                <Button
                  type="submit"
                  onClick={() => setIsChannelPickerOpen(false)}
                >
                  {ct("add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={addNote} onOpenChange={setAddNote}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{ct("addNote")}</DialogTitle>
                <DialogDescription>
                  {ct("addNoteDescription")}
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{ft("note")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!isEditing}
                        placeholder={ft("enterNote")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-4">
                <Button variant="secondary" onClick={() => setAddNote(false)}>
                  {ct("cancel")}
                </Button>
                <Button
                  type="submit"
                  onClick={() => handleAddNote(form.getValues("note"))}
                >
                  {ct("add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}

export default CustomerForm;
