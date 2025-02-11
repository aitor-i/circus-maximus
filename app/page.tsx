import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sword, Anchor, PawPrint as Paw, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { getDictionary } from "@/translations/getDictionary";
import { HeroSection } from "@/components/HeroSection/HeroSection";
import EventSection from "@/components/EventSection/EventSection";

export default async function Home() {
  const dict = await getDictionary("en");
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <HeroSection />
      {/* Featured Events */}
      <EventSection />
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
