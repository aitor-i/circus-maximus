"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sword, Anchor, PawPrint as Paw, ShoppingBag } from "lucide-react";
import Link from "next/link";

const events = [
  {
    title: "Gladiator Championship",
    description: "Epic battles between the finest warriors",
    date: "2025-04-15",
    icon: Sword,
    price: 100,
    image: "https://images.unsplash.com/photo-1608444962819-c2928b93fbf9?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Naval Spectacle",
    description: "Magnificent sea battles in our flooded arena",
    date: "2025-04-22",
    icon: Anchor,
    price: 150,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Beast Arena",
    description: "Witness exotic beasts in thrilling encounters",
    date: "2025-04-29",
    icon: Paw,
    price: 120,
    image: "https://images.unsplash.com/photo-1577507123028-ef53b3c80bb6?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1920')",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">The Grand Coliseum</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience the thrill of ancient Rome with modern comfort
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/events">View Events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">Visit Shop</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
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
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${event.price}</span>
                    <Button>Book Now</Button>
                  </div>
                </div>
              </Card>
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