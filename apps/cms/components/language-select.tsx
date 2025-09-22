import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { supportedLocalesJson } from "@/data/supportedLocales";
import { useLocale } from "next-intl";
import { redirect, usePathname } from "next/navigation";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
function LanguageSelect() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <Select
      defaultValue={locale}
      onValueChange={(value) => {
        const newPathname = pathname.startsWith(`/${locale}`)
          ? pathname.slice(`/${locale}`.length)
          : pathname;
        redirect(`/${value}${newPathname}`);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {supportedLocalesJson.map((lang) => (
            <SelectItem key={lang.locale} value={lang.locale}>
              <CircleFlag
                countryCode={lang.countryCode}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm">{lang.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default LanguageSelect;
