import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import Image from "next/image";
import { Badge } from "@workspace/ui/components/badge";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import channels from "@/data/channels.json";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

function CustomerCard({
  id,
  firstName,
  lastName,
  image,
  countryCode,
  email,
  type,
  channel,
  checked,
  onCheckedChange,
}: {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  countryCode: string;
  email: string;
  type: string;
  channel: {
    id: number;
    label: string;
    value: string;
    resellerCode: string;
    image: string;
  };
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const router = useRouter();
  const t = useTranslations("Common");
  const customerChannel = channels.find(
    (c) => c.resellerCode === channel.resellerCode
  );

  return (
    <Card
      onClick={() => router.push(`/customers/${id}`)}
      className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group pt-0 gap-4"
    >
      <CardHeader className="px-0 py-0 relative">
        <div className="absolute top-2 left-4 z-10">
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="absolute top-2 right-4 z-10">
          <Avatar className="h-8 w-8 rounded-full bg-card">
            <AvatarImage
              src={customerChannel?.image as string}
              alt={customerChannel?.resellerCode as string}
              className="object-contain w-5 mx-auto"
            />
            <AvatarFallback className="rounded-full">
              {`${customerChannel?.resellerCode?.charAt(0)}`}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="h-64 3xl:h-80 bg-muted/20 relative overflow-hidden">
          <Image
            src={image ? image : "/placeholder.svg"}
            alt={firstName}
            fill
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            {type || t("unknown")}
          </Badge>
          <CircleFlag
            className="h-4 w-4"
            countryCode={countryCode.toLowerCase()}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-0 text-base line-clamp-2">
            {firstName} {lastName}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <a
            href={`mailto:${email}`}
            className="text-xs text-muted-foreground truncate max-w-[60%]"
            onClick={(e) => e.stopPropagation()}
          >
            {email}
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">ID: {id}</span>
      </CardFooter>
    </Card>
  );
}

export default CustomerCard;
