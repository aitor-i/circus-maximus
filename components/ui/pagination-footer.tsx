import type React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export const PaginationFooter = ({
  totalPages,
  currentPage,
}: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  console.log("currentPage", currentPage);

  return (
    <nav className="flex items-center justify-center space-x-2">
      <Link
        href={currentPage === 1 ? "#" : `/events/${currentPage - 1}`}
        className="flex items-center gap-2 font-bold text-xl"
      >
        <Button variant="outline" size="icon" disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
      </Link>

      {pageNumbers.map((number) => (
        <Link href={`/events/${number}`} key={number}>
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="icon"
          >
            {number}
          </Button>
        </Link>
      ))}

      <Link
        href={currentPage === totalPages ? "#" : `/events/${currentPage + 1}`}
        className="flex items-center gap-2 font-bold text-xl"
      >
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </Link>

      <span className="text-sm text-muted-foreground ml-4">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
};
