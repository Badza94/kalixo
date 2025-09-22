/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import * as z from "@workspace/ui/lib/zod";
import { zodResolver } from "@workspace/ui/lib/hookform";
import PageTitle from "@/components/page-title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ChevronLeft, PlusIcon, Shield, X } from "@workspace/ui/lucide-react";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { format } from "@workspace/ui/lib/date-fns";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { toast } from "@workspace/ui/sonner";
import { Timeline, TimelineEntry } from "@workspace/ui/components/timeline";
import Notes from "@/components/notes";
import timelineData from "@/data/timeline-fake.json";
import notes from "@/data/notes.json";
// import { User } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Check, ChevronsUpDown } from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { SelectSearch } from "@workspace/ui/components/select-search";

const USER_STATUSES = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

const USER_ROLES = [
  { label: "Super Administrator", value: "superAdministrator" },
  { label: "Administrator", value: "administrator" },
  { label: "Channel Admin", value: "channelAdmin" },
  { label: "Admin View", value: "adminView" },
  { label: "Company Admin", value: "companyAdmin" },
  { label: "Company Channel Admin", value: "companyChannelAdmin" },
  { label: "Partner", value: "partner" },
  { label: "Vendor", value: "vendor" },
  { label: "Agency", value: "agency" },
];

type TUserFormProps = {
  id: string;
  countries: any[];
  channels: any[];
  user?: any;
  currentUser: any;
};

export default function UserForm({
  id,
  countries,
  channels,
  user,
  currentUser,
}: TUserFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(
    user?.relevantChannels || []
  );
  const [isChannelPickerOpen, setIsChannelPickerOpen] = useState(false);

  const ct = useTranslations("Common");
  const ft = useTranslations("Forms");
  const t = useTranslations("Settings.Users.userForm");

  const formSchema = z.object({
    firstName: z.string().min(1, { message: ft("Errors.requiredFirstName") }),
    lastName: z.string().min(1, { message: ft("Errors.requiredLastName") }),
    email: z.string().email({ message: ft("Errors.invalidEmail") }),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    companyId: z.string().optional(),
    role: z.string().min(1, { message: ft("Errors.requiredRole") }),
    status: z.enum(["active", "inactive", "pending", "suspended"], {
      message: ft("Errors.requiredStatus"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      countryCode: user?.countryCode || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      companyId: user?.companyId || "",
      role: user?.role || "",
      status: user?.status || "active",
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
    toast.success("User information updated successfully!");
  }

  const handleAddChannel = (channel: any) => {
    if (!selectedChannels.find((c: any) => c.id === channel.id)) {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleRemoveChannel = (channelId: string) => {
    setSelectedChannels(
      selectedChannels.filter((c: any) => c.id !== channelId)
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors: {
      [key: string]: "destructive" | "default" | "secondary" | "outline";
    } = {
      superAdministrator: "destructive",
      administrator: "destructive",
      channelAdmin: "default",
      companyAdmin: "default",
      adminView: "secondary",
      companyChannelAdmin: "outline",
      partner: "outline",
      vendor: "secondary",
      agency: "secondary",
    };

    const roleLabels: { [key: string]: string } = {
      superAdministrator: "Super Administrator",
      administrator: "Administrator",
      channelAdmin: "Channel Admin",
      adminView: "Admin View",
      companyAdmin: "Company Admin",
      companyChannelAdmin: "Company Channel Admin",
      partner: "Partner",
      vendor: "Vendor",
      agency: "Agency",
    };

    return (
      <Badge variant={roleColors[role] || "secondary"}>
        {roleLabels[role] || role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      active: "default",
      pending: "secondary",
      inactive: "outline",
      suspended: "destructive",
    };

    return (
      <Badge variant={statusColors[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/settings/users">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user?.avatar || "/placeholder.svg"}
                alt={user?.firstName}
              />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <PageTitle
                title={`${user?.firstName || ""} ${user?.lastName || ""}`}
                description={`${t("userSince")} ${user?.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : ""}`}
              />
            </div>
          </div>
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
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 xl:flex-[2] space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("userInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("firstName")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="John"
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
                            <FormLabel>{t("lastName")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="Doe"
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
                            <FormLabel>{t("email")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="john@example.com"
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
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("userType")}</FormLabel>
                            <FormControl>
                              <Select
                                disabled={!isEditing}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {USER_ROLES.map((role) => (
                                    <SelectItem
                                      key={role.value}
                                      value={role.value}
                                    >
                                      {role.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormItem>
                        <FormLabel>{t("joiningDate")}</FormLabel>
                        <FormControl>
                          <Input
                            value={
                              user?.createdAt
                                ? format(
                                    new Date(user.createdAt),
                                    "MMMM d, yyyy"
                                  )
                                : ""
                            }
                            disabled
                            placeholder="January 1, 2024"
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("phoneNumber")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="+1 (555) 123-4567"
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
                    <div className="col-span-2 xl:col-span-1">
                      <FormItem>
                        <FormLabel>{t("ipAddress")}</FormLabel>
                        <FormControl>
                          <Input
                            value="192.168.1.1"
                            disabled
                            placeholder="192.168.1.1"
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>
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

            <div className="space-y-4 flex flex-col flex-1 xl:flex-[1]">
              <Card>
                <CardHeader>
                  <CardTitle>{t("status")}</CardTitle>
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
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {USER_STATUSES.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {getStatusBadge(status.value)}
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
                  <CardTitle>{t("role")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={!isEditing}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {USER_ROLES.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {getRoleBadge(role.value)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="space-y-2">
                      {getRoleBadge(user?.role || "user")}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("security")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {t("twoFactorAuthentication")}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      {t("enabled")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("channels")}</CardTitle>
                    <Button
                      variant="secondary"
                      size="sm"
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
                      {selectedChannels.map((ch: any) => {
                        const channel = channels?.find(
                          (c: any) => c.id === ch.id
                        );
                        return (
                          <Badge
                            key={ch?.id}
                            variant="secondary"
                            className="flex items-center gap-2 pr-2"
                          >
                            <Avatar className="h-4 w-4 rounded-full">
                              <AvatarImage
                                src={channel?.image as string}
                                alt={channel?.label as string}
                              />
                              <AvatarFallback className="rounded-full">
                                {channel?.label?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {ch?.label}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveChannel(ch?.id)}
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
                <CardHeader>
                  <CardTitle>{t("tags")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("noActivityTags")}
                  </p>
                </CardContent>
              </Card>

              <div className="col-span-12 xl:col-span-4">
                <Notes notes={notes} currentUser={currentUser} companyId={id} />
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Channel Picker Dialog */}
      <Dialog open={isChannelPickerOpen} onOpenChange={setIsChannelPickerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("addChannel")}</DialogTitle>
            <DialogDescription>{t("addChannelDescription")}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">{t("channels")}</label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !selectedChannels.length && "text-muted-foreground"
                    )}
                  >
                    {selectedChannels.length > 0
                      ? `${selectedChannels.length} selected`
                      : "Select channels"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
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
                          {channels?.map((channel: any) => (
                            <CommandItem
                              key={channel.id}
                              value={channel.label}
                              onSelect={() => {
                                const isSelected = selectedChannels.some(
                                  (c: any) => c.id === channel.id
                                );
                                if (isSelected) {
                                  handleRemoveChannel(channel.id);
                                } else {
                                  handleAddChannel(channel);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={channel.image || "/placeholder.svg"}
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
                                  selectedChannels.some(
                                    (c: any) => c.id === channel.id
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
            </div>
          </ScrollArea>
          <DialogFooter className="gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsChannelPickerOpen(false)}
            >
              {ct("cancel")}
            </Button>
            <Button type="submit" onClick={() => setIsChannelPickerOpen(false)}>
              {ct("add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
