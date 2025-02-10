"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sword, Anchor, PawPrint as Paw, ShoppingBag } from "lucide-react";
import Link from "next/link";

import beastArena from "@/public/asests/beast-arena.webp";
import gladiators from "@/public/asests/gladiators.webp";
import navalSpectacle from "@/public/asests/naval-spectacle.webp";
import { getDictionary } from "@/translations/getDictionary";
import { HeroSection } from "@/components/HeroSection/HeroSection";

const events = [
  {
    title: "Gladiator Championship",
    description: "Epic battles between the finest warriors",
    date: "2025-04-15",
    icon: Sword,
    price: 100,
    image: gladiators.src,
  },
  {
    title: "Naval Spectacle",
    description: "Magnificent sea battles in our flooded arena",
    date: "2025-04-22",
    icon: Anchor,
    price: 150,
    image: navalSpectacle.src,
  },
  {
    title: "Beast Arena",
    description: "Witness exotic beasts in thrilling encounters",
    date: "2025-04-29",
    icon: Paw,
    price: 120,
    image: beastArena.src,
  },
];

export default async function Home() {
  const dict = await getDictionary("en");
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <HeroSection />
      {/* Featured Events */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link href={`/events/${event.title}`} key={event.title}>
                <Card key={event.title} className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <event.icon className="w-5 h-5" />
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${event.price}</span>
                      <Button>Book Now</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Preview */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Official Merchandise</h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <ShoppingBag className="w-8 h-8" />
            <p className="text-xl">Get your exclusive coliseum merchandise</p>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/shop">Visit Shop</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
