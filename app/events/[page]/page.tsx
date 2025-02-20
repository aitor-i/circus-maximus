import React from "react";
import { getDictionary } from "@/translations/getDictionary";
import {
  getEvents,
  getEventsWithPagination,
} from "@/server-actions/events/events";
import EventCard from "@/components/EventCard/EventCard";
import Link from "next/link";
import { PaginationFooter } from "@/components/ui/pagination-footer";

interface PageParams {
  params: { page: string };
}

export async function generateStaticParams() {
  const { pagination } = await getEventsWithPagination();
  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1,
  );

  return pageNumbers;
}

export default async function page({ params }: PageParams) {
  const dict = await getDictionary("en");
  const { events, pagination } = await getEventsWithPagination(
    Number(params.page),
    12,
  );

  return (
    <div className="px-4 md:px-8">
      <h1>Events</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      <div className="py-8">
        <PaginationFooter
          currentPage={Number(params.page)}
          totalPages={pagination.totalPages}
        />
      </div>
    </div>
  );
}
