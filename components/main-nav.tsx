"use client";

import Link from "next/link";
import { Sword, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Sword className="w-6 h-6" />
          <span>Circus Maximus</span>
        </Link>
        <nav className="flex items-center flex-1 justify-end gap-6">
          <Link
            href="/events"
            className="text-sm font-medium hover:text-primary"
          >
            Events
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-primary">
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
