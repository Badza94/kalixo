"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpDown } from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";
interface DynamicPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  initialLimit: string;
}

function buildPageHref(page: number, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(page));
  return `?${params.toString()}`;
}

function DynamicPagination({
  currentPage,
  totalPages,
  className = "",
  initialLimit,
}: DynamicPaginationProps) {
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState(initialLimit);

  if (totalPages <= 1) return null;

  // Helper to generate page numbers (with ellipsis for large sets)
  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-between w-full items-center flex-wrap gap-4">
      <Pagination
        className={cn("justify-start w-auto ml-0 flex-wrap", className)}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                currentPage > 1
                  ? buildPageHref(currentPage - 1, searchParams)
                  : undefined
              }
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {getPages().map((page, idx) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href={buildPageHref(page as number, searchParams)}
                  isActive={page === currentPage}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? buildPageHref(currentPage + 1, searchParams)
                  : undefined
              }
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Select value={limit} onValueChange={setLimit}>
        <SelectTrigger className="justify-between">
          <div className="flex items-center">
            <ArrowUpDown className="mr-2 h-4 w-4 opacity-70" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default DynamicPagination;
