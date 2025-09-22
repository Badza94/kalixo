import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal, PencilIcon, Trash2 } from "@workspace/ui/lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

function AttributesTable({
  data,
  onEdit,
  onDelete,
}: {
  data: {
    id: number;
    name: string;
    iconUrl?: string;
  }[];
  onEdit: (data: { id: number; name: string; iconUrl?: string }) => void;
  onDelete: (data: { id: number; name: string; iconUrl?: string }) => void;
}) {
  const ct = useTranslations("Common");

  return (
    <ScrollArea className="h-[400px]">
      <Table className="table-fixed w-full overflow-x-auto whitespace-normal">
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead>{ct("name")}</TableHead>
            <TableHead>{ct("icon")}</TableHead>
            <TableHead className="text-right w-[50px]">
              {ct("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.name}</TableCell>
              <TableCell>
                <div className="h-10 w-10 rounded-md overflow-hidden border">
                  <Image
                    src={data.iconUrl || "/placeholder.svg"}
                    alt={data.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">{ct("openMenu")}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-background border shadow-lg"
                  >
                    <DropdownMenuItem onClick={() => onEdit(data)}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      {ct("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(data)}>
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      {ct("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export default AttributesTable;
