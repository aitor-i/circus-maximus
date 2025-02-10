import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDictionary } from "@/translations/getDictionary";

export async function HeroSection(props: {}) {
  const dict = await getDictionary("en");
  return (
    <section className="relative h-[80vh] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1920')",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {dict.homePage.heroSection.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {dict.homePage.heroSection.description}
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/events">
              {dict.homePage.heroSection.events.viewAll}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">{dict.homePage.heroSection.events.viewAll}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
